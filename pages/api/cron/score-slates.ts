import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { computeLineupPoints, PlayerStats } from '../../../lib/scoring';

const prisma = new PrismaClient();

interface CronResponse {
  slatesProcessed: number;
  slatesToProcess: number;
  errors: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const cronSecret = req.headers['x-vercel-cron-secret'];
  if (cronSecret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const errors: string[] = [];

  try {
    const now = new Date();

    // Step 1: Mark OPEN slates as LOCKED if past lockAt time
    const openPastLock = await prisma.slate.findMany({
      where: {
        status: 'OPEN',
        lockAt: { lte: now }
      }
    });

    for (const slate of openPastLock) {
      try {
        await prisma.slate.update({
          where: { id: slate.id },
          data: { status: 'LOCKED' }
        });
      } catch (err) {
        errors.push(`Failed to lock slate ${slate.id}: ${String(err)}`);
      }
    }

    // Step 2: Find LOCKED slates where all fixtures are FT
    const lockedSlates = await prisma.slate.findMany({
      where: { status: 'LOCKED' },
      include: {
        fixtures: {
          include: { fixture: true }
        }
      }
    });

    let totalProcessed = 0;
    let totalLineups = 0;

    for (const slate of lockedSlates) {
      try {
        const allFT = slate.fixtures.every(sf => sf.fixture.status === 'FT');
        if (!allFT) continue;

        // Step 3: Query all lineups for this slate
        const lineups = await prisma.slateLineup.findMany({
          where: { slateId: slate.id },
          include: {
            entry: true,
            picks: {
              include: { player: true }
            }
          }
        });

        if (lineups.length === 0) {
          // No lineups, mark as completed anyway
          await prisma.slate.update({
            where: { id: slate.id },
            data: { status: 'SCORED' }
          });
          continue;
        }

        // Step 4: Fetch fixture stats for all players
        const fixtureIds = slate.fixtures.map(sf => sf.fixtureId);
        const allStats = await prisma.playerFixtureStat.findMany({
          where: { fixtureId: { in: fixtureIds } }
        });

        const statsMap = new Map(allStats.map(s => [`${s.fixtureId}:${s.playerId}`, s]));

        // Step 5: Compute points for each lineup
        for (const lineup of lineups) {
          try {
            const lineupFixtureStats = lineup.picks
              .map(pick => {
                let totalStats = {
                  minutes: 0,
                  goals: 0,
                  assists: 0,
                  cleanSheet: true,
                  goalsConceded: 0,
                  saves: 0,
                  pensSaved: 0,
                  pensMissed: 0,
                  yellow: 0,
                  red: 0,
                  ownGoal: 0
                };

                for (const fixtureId of fixtureIds) {
                  const stat = statsMap.get(`${fixtureId}:${pick.playerId}`);
                  if (stat) {
                    totalStats.minutes += stat.minutes;
                    totalStats.goals += stat.goals;
                    totalStats.assists += stat.assists;
                    totalStats.goalsConceded += stat.goalsConceded;
                    totalStats.saves += stat.saves;
                    totalStats.pensSaved += stat.pensSaved;
                    totalStats.pensMissed += stat.pensMissed;
                    totalStats.yellow += stat.yellow;
                    totalStats.red += stat.red;
                    totalStats.ownGoal += stat.ownGoal;
                    if (stat.cleanSheet === false) {
                      totalStats.cleanSheet = false;
                    }
                  }
                }

                return {
                  playerId: pick.playerId,
                  stats: totalStats as PlayerStats
                };
              });

            const picks = lineup.picks.map(p => ({
              playerId: p.playerId,
              position: p.player.position,
              isCaptain: p.isCaptain
            }));

            const { total } = computeLineupPoints(picks, lineupFixtureStats);

            // Step 6: Create SlateEntryPoints record
            await prisma.slateEntryPoints.upsert({
              where: { lineupId: lineup.id },
              create: {
                lineupId: lineup.id,
                points: total
              },
              update: { points: total }
            });

            totalLineups++;
          } catch (err) {
            errors.push(`Failed to score lineup ${lineup.id}: ${String(err)}`);
          }
        }

        // Step 7: Mark slate as COMPLETED (SCORED)
        await prisma.slate.update({
          where: { id: slate.id },
          data: { status: 'SCORED' }
        });

        totalProcessed++;
      } catch (err) {
        errors.push(`Failed to process slate ${slate.id}: ${String(err)}`);
      }
    }

    // Step 8: Update EntryTotalPoints for all entries
    const allEntries = await prisma.entry.findMany();
    for (const entry of allEntries) {
      try {
        const lineups = await prisma.slateLineup.findMany({
          where: { entryId: entry.id },
          include: { points: true }
        });

        const total = lineups.reduce((sum, lineup) => sum + (lineup.points?.points || 0), 0);

        await prisma.entryTotalPoints.upsert({
          where: { entryId: entry.id },
          create: { entryId: entry.id, total },
          update: { total }
        });
      } catch (err) {
        errors.push(`Failed to update total points for entry ${entry.id}: ${String(err)}`);
      }
    }

    return res.status(200).json({
      slatesProcessed: totalProcessed,
      slatesToProcess: lockedSlates.length,
      errors
    });
  } catch (error) {
    console.error('Cron error:', error);
    return res.status(500).json({
      slatesProcessed: 0,
      slatesToProcess: 0,
      errors: [`Cron failed: ${String(error)}`]
    });
  }
}
