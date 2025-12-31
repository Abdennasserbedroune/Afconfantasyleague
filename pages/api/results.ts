import prisma from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/middleware';

async function handler(req: NextApiRequest & { user?: any }, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.user.userId;

  try {
    const latestScoredLineup = await prisma.slateLineup.findFirst({
      where: {
        entry: { userId },
        slate: { status: 'SCORED' }
      },
      orderBy: { slate: { lockAt: 'desc' } },
      include: {
        slate: true,
        points: true,
        picks: {
          include: {
            player: {
              include: {
                team: true,
                fixtureStats: {
                  include: {
                    fixture: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!latestScoredLineup) {
      return res.status(404).json({ error: 'No scored lineups found' });
    }

    const formattedPicks = latestScoredLineup.picks.map(pick => {
      const stats = pick.player.fixtureStats[0]; 
      
      return {
        id: pick.player.id,
        name: pick.player.name,
        team: pick.player.team.name,
        isCaptain: pick.isCaptain,
        totalPoints: 0, // In a real app, this would be calculated
        stats: stats ? {
          minutes: stats.minutes,
          goals: stats.goals,
          assists: stats.assists,
          cleanSheet: stats.cleanSheet,
          yellowCards: stats.yellow,
          redCards: stats.red,
          ownGoals: stats.ownGoal,
        } : null
      };
    });

    return res.status(200).json({
      slateName: latestScoredLineup.slate.name,
      totalPoints: latestScoredLineup.points?.points || 0,
      picks: formattedPicks
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch results' });
  }
}

export default withAuth(handler);
