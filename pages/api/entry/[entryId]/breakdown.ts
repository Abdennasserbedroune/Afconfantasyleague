import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware';

interface SlateBreakdown {
  slateId: string;
  slateName: string;
  points: number;
  picks: Array<{
    playerId: string;
    name: string;
    position: string;
    isCaptain: boolean;
  }>;
}

interface EntryBreakdownResponse {
  entryId: string;
  displayName: string;
  total: number;
  slates: SlateBreakdown[];
}

async function handler(req: NextApiRequest & { user?: any }, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { entryId } = req.query;
  const userId = req.user.userId;

  try {
    const entry = await prisma.entry.findUnique({
      where: { id: entryId as string },
      include: { user: true, totalPoints: true }
    });

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    if (entry.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const lineups = await prisma.slateLineup.findMany({
      where: { entryId: entry.id },
      include: {
        slate: true,
        points: true,
        picks: {
          include: { player: true }
        }
      }
    });

    const slates = lineups.map(lineup => ({
      slateId: lineup.slateId,
      slateName: lineup.slate.name,
      points: lineup.points?.points || 0,
      picks: lineup.picks.map(p => ({
        playerId: p.playerId,
        name: p.player.name,
        position: p.player.position,
        isCaptain: p.isCaptain
      }))
    }));

    const response: EntryBreakdownResponse = {
      entryId: entry.id,
      displayName: entry.displayName,
      total: entry.totalPoints?.total || 0,
      slates
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch breakdown' });
  }
}

export default withAuth(handler);
