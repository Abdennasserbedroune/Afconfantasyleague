import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware';

interface LineupRequestBody {
  playerIds: string[];
  captainId: string;
}

async function handler(req: NextApiRequest & { user?: { userId: string; email: string } }, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const slateIdParam = Array.isArray(req.query.slateId) ? req.query.slateId[0] : req.query.slateId;
  if (typeof slateIdParam !== 'string' || slateIdParam.length === 0) {
    return res.status(400).json({ error: 'slateId is required' });
  }

  const slateId = slateIdParam;

  const { playerIds, captainId } = (req.body ?? {}) as Partial<LineupRequestBody>;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const now = new Date();

  // ============ VALIDATION ============

  // 1. Slate exists and is OPEN
  const slate = await prisma.slate.findUnique({
    where: { id: slateId },
    include: { fixtures: { include: { fixture: true } } },
  });

  if (!slate) {
    return res.status(404).json({ error: 'Slate not found' });
  }

  if (slate.status !== 'OPEN' || now >= slate.lockAt) {
    return res.status(403).json({ error: 'Slate is locked' });
  }

  // 2. Exactly 11 players
  if (!playerIds || !Array.isArray(playerIds) || playerIds.length !== 11) {
    return res.status(400).json({ error: 'Exactly 11 players required' });
  }

  if (!playerIds.every((id) => typeof id === 'string' && id.length > 0)) {
    return res.status(400).json({ error: 'Invalid playerIds' });
  }

  // Check for duplicates
  if (new Set(playerIds).size !== 11) {
    return res.status(400).json({ error: 'Duplicate players not allowed' });
  }

  // 3. Captain validation
  if (!captainId || typeof captainId !== 'string' || !playerIds.includes(captainId)) {
    return res.status(400).json({ error: 'Captain must be one of the 11 players' });
  }

  // 4. Get all eligible teams in this slate
  const eligibleTeamIds = new Set<string>();
  for (const sf of slate.fixtures) {
    eligibleTeamIds.add(sf.fixture.homeTeamId);
    eligibleTeamIds.add(sf.fixture.awayTeamId);
  }

  // 5. Fetch players and validate eligibility
  const players = await prisma.player.findMany({
    where: { id: { in: playerIds } },
    include: { team: true },
  });

  if (players.length !== 11) {
    return res.status(400).json({ error: 'One or more players not found' });
  }

  for (const player of players) {
    if (!player.isActive) {
      return res.status(403).json({ error: `Player ${player.name} is not eligible` });
    }

    if (!eligibleTeamIds.has(player.teamId)) {
      return res
        .status(403)
        .json({ error: `Player ${player.name} is from team not in this slate's fixtures` });
    }
  }

  // 6. Max 3 per team
  const playersByTeam: Record<string, { count: number; teamName: string }> = {};
  for (const player of players) {
    const current = playersByTeam[player.teamId];
    playersByTeam[player.teamId] = {
      count: (current?.count ?? 0) + 1,
      teamName: player.team.name,
    };
  }

  for (const teamInfo of Object.values(playersByTeam)) {
    if (teamInfo.count > 3) {
      return res
        .status(400)
        .json({ error: `Max 3 players from ${teamInfo.teamName} allowed (you picked ${teamInfo.count})` });
    }
  }

  // ============ UPSERT ============

  try {
    let entry = await prisma.entry.findUnique({
      where: { userId },
    });

    if (!entry) {
      const emailPrefix = req.user?.email?.split('@')[0] ?? 'My';
      const displayName = `${emailPrefix}'s team`;
      entry = await prisma.entry.create({
        data: {
          userId,
          displayName,
        },
      });
    }

    const lineup = await prisma.$transaction(async (tx) => {
      const lockNow = new Date();

      const upsertedLineup = await tx.slateLineup.upsert({
        where: {
          entryId_slateId: {
            entryId: entry.id,
            slateId,
          },
        },
        create: {
          entryId: entry.id,
          slateId,
          lockedAt: lockNow >= slate.lockAt ? lockNow : null,
        },
        update: {
          lockedAt: lockNow >= slate.lockAt ? lockNow : undefined,
        },
      });

      await tx.slateLineupPick.deleteMany({
        where: { lineupId: upsertedLineup.id },
      });

      await tx.slateLineupPick.createMany({
        data: playerIds.map((pid) => ({
          lineupId: upsertedLineup.id,
          playerId: pid,
          isCaptain: pid === captainId,
        })),
      });

      return upsertedLineup;
    });

    const fullLineup = await prisma.slateLineup.findUnique({
      where: { id: lineup.id },
      include: {
        picks: {
          include: {
            player: {
              include: { team: true },
            },
          },
        },
      },
    });

    const response = {
      lineupId: fullLineup?.id,
      slateId: slate.id,
      picks:
        fullLineup?.picks.map((pick) => ({
          playerId: pick.player.id,
          name: pick.player.name,
          team: pick.player.team.name,
          position: pick.player.position,
          isCaptain: pick.isCaptain,
        })) ?? [],
      createdAt: fullLineup?.createdAt,
      lockedAt: fullLineup?.lockedAt,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Lineup submission error:', error);
    return res.status(500).json({ error: 'Failed to save lineup' });
  }
}

export default withAuth(handler);
