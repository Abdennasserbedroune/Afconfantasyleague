import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const entries = await prisma.entry.findMany({
      include: { totalPoints: true },
      orderBy: {
        totalPoints: {
          total: 'desc'
        }
      }
    });

    const leaderboard = entries.map((entry, idx) => ({
      rank: idx + 1,
      entryId: entry.id,
      displayName: entry.displayName,
      total: entry.totalPoints?.total || 0,
      slatesPlayed: 0
    }));

    for (const item of leaderboard) {
      const slatesPlayed = await prisma.slateLineup.count({
        where: { entryId: item.entryId }
      });
      item.slatesPlayed = slatesPlayed;
    }

    return res.status(200).json(leaderboard);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}
