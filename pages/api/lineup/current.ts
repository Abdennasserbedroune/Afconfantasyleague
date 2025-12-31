import prisma from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/middleware';

async function handler(req: NextApiRequest & { user?: any }, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.user.userId;

  try {
    const nextOpenSlate = await prisma.slate.findFirst({
      where: { status: 'OPEN' },
      orderBy: { lockAt: 'asc' }
    });

    if (!nextOpenSlate) {
      return res.status(404).json({ error: 'No open slates found' });
    }

    const currentLineup = await prisma.slateLineup.findFirst({
      where: {
        entry: { userId },
        slateId: nextOpenSlate.id
      },
      include: {
        picks: {
          include: {
            player: true
          }
        }
      }
    });

    return res.status(200).json({
      slate: nextOpenSlate,
      lineup: currentLineup ? currentLineup.picks.map(p => ({ ...p.player, isCaptain: p.isCaptain })) : []
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch current lineup' });
  }
}

export default withAuth(handler);
