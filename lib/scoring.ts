export interface PlayerStats {
  minutes: number;
  goals: number;
  assists: number;
  cleanSheet: boolean;
  goalsConceded: number;
  saves: number;
  pensSaved: number;
  pensMissed: number;
  yellow: number;
  red: number;
  ownGoal: number;
}

export function computePlayerPoints(position: string, stats: PlayerStats): number {
  let points = 0;

  // 1. Playing time
  if (stats.minutes > 0 && stats.minutes < 60) {
    points += 1;
  } else if (stats.minutes >= 60) {
    points += 2;
  }

  // 2. Goals
  const goalsByPosition: Record<string, number> = {
    GK: 10,
    DEF: 6,
    MID: 5,
    FWD: 4
  };
  points += (stats.goals || 0) * (goalsByPosition[position] || 0);

  // 3. Assists
  points += (stats.assists || 0) * 3;

  // 4. Clean sheets (requires 60+ mins)
  if (stats.minutes >= 60 && stats.cleanSheet) {
    if (position === 'GK' || position === 'DEF') {
      points += 4;
    } else if (position === 'MID') {
      points += 1;
    }
  }

  // 5. Saves (GK only)
  if (position === 'GK') {
    points += Math.floor((stats.saves || 0) / 3);
  }

  // 6. Penalty saves
  points += (stats.pensSaved || 0) * 5;

  // 7. Goals conceded (GK/DEF only)
  if (position === 'GK' || position === 'DEF') {
    points -= Math.floor((stats.goalsConceded || 0) / 2);
  }

  // 8. Yellow card
  points -= (stats.yellow || 0) * 1;

  // 9. Red card
  points -= (stats.red || 0) * 3;

  // 10. Penalty miss
  points -= (stats.pensMissed || 0) * 2;

  // 11. Own goal
  points -= (stats.ownGoal || 0) * 2;

  return Math.max(0, points);
}

export interface LineupPick {
  playerId: string;
  position: string;
  isCaptain: boolean;
}

export interface FixtureStat {
  playerId: string;
  stats: PlayerStats;
}

export function computeLineupPoints(picks: LineupPick[], fixtureStats: FixtureStat[]): { total: number; breakdown: Record<string, number> } {
  const breakdown: Record<string, number> = {};
  let total = 0;

  const statsMap = new Map(fixtureStats.map(fs => [fs.playerId, fs.stats]));

  for (const pick of picks) {
    const stats = statsMap.get(pick.playerId) || {
      minutes: 0,
      goals: 0,
      assists: 0,
      cleanSheet: false,
      goalsConceded: 0,
      saves: 0,
      pensSaved: 0,
      pensMissed: 0,
      yellow: 0,
      red: 0,
      ownGoal: 0
    };

    const playerPoints = computePlayerPoints(pick.position, stats);
    breakdown[pick.playerId] = playerPoints;
    total += playerPoints;
  }

  return { total, breakdown };
}
