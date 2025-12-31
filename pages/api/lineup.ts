import prisma from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/middleware';

async function handler(req: NextApiRequest & { user?: any }, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.user.userId;
  const { slateId, picks } = req.body;

  if (!slateId || !picks || !Array.isArray(picks)) {
    return res.status(400).json({ error: 'Missing slateId or picks' });
  }

  try {
    // Check if slate is still open
    const slate = await prisma.slate.findUnique({
      where: { id: slateId }
    });

    if (!slate || slate.status !== 'OPEN') {
      return res.status(400).json({ error: 'Slate is closed' });
    }

    // Get or create entry for user
    let entry = await prisma.entry.findUnique({
      where: { userId }
    });

    if (!entry) {
      entry = await prisma.entry.create({
        data: {
          userId,
          displayName: req.user.email, // Fallback
        }
      });
    }

    // Upsert lineup
    const lineup = await prisma.slateLineup.upsert({
      where: {
        entryId_slateId: {
          entryId: entry.id,
          slateId: slateId,
        }
      },
      update: {
        picks: {
          deleteMany: {},
          create: picks.map((p: any) => ({
            playerId: p.playerId,
            isCaptain: p.isCaptain
          }))
        }
      },
      create: {
        entryId: entry.id,
        slateId: slateId,
        picks: {
          create: picks.map((p: any) => ({
            playerId: p.playerId,
            isCaptain: p.isCaptain
          }))
        }
      }
    });

    return res.status(200).json(lineup);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to save lineup' });
  }
}

export default withAuth(handler);
