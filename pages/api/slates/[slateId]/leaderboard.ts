import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

interface SlateLeaderboardResponse {
  slateName: string;
  slateDate: string;
  entries: Array<{
    rank: number;
    entryId: string;
    displayName: string;
    points: number;
  }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SlateLeaderboardResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slateId } = req.query;

  try {
    const slate = await prisma.slate.findUnique({
      where: { id: slateId as string },
      include: {
        lineups: {
          include: {
            entry: true,
            points: true
          },
          orderBy: {
            points: {
              points: 'desc'
            }
          }
        }
      }
    });

    if (!slate) {
      return res.status(404).json({ error: 'Slate not found' } as any);
    }

    const entries = slate.lineups
      .filter(lineup => lineup.points !== null)
      .map((lineup, idx) => ({
        rank: idx + 1,
        entryId: lineup.entry.id,
        displayName: lineup.entry.displayName,
        points: lineup.points!.points
      }));

    const response: SlateLeaderboardResponse = {
      slateName: slate.name,
      slateDate: slate.dateLocal.toISOString(),
      entries
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch slate leaderboard' } as any);
  }
}
