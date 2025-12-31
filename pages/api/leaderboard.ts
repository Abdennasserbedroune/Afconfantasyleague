import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { optionalAuth } from '@/lib/middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type } = req.query;
  const user = optionalAuth(req);

  try {
    let rankings = [];

    if (type === 'today') {
      const latestScoredSlate = await prisma.slate.findFirst({
        where: { status: 'SCORED' },
        orderBy: { lockAt: 'desc' }
      });

      if (latestScoredSlate) {
        const slateEntries = await prisma.slateLineup.findMany({
          where: { slateId: latestScoredSlate.id },
          include: { 
            entry: true,
            points: true
          },
          orderBy: { points: { points: 'desc' } }
        });

        rankings = slateEntries.map((se, idx) => ({
          rank: idx + 1,
          teamName: se.entry.displayName,
          points: se.points?.points || 0
        }));
      }
    } else {
      const entries = await prisma.entry.findMany({
        include: { totalPoints: true },
        orderBy: { totalPoints: { total: 'desc' } }
      });

      rankings = entries.map((entry, idx) => ({
        rank: idx + 1,
        teamName: entry.displayName,
        points: entry.totalPoints?.total || 0
      }));
    }

    let currentUser = null;
    if (user) {
      currentUser = rankings.find(r => r.teamName === user.email); // Simplified, should be by userId/displayName
    }

    return res.status(200).json({ rankings, currentUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}
