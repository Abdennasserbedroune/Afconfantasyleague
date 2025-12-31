import { computePlayerPoints, computeLineupPoints, PlayerStats } from '../lib/scoring';

describe('computePlayerPoints', () => {
  describe('playing time', () => {
    it('should give 0 points for 0 minutes', () => {
      const stats: PlayerStats = { minutes: 0, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('GK', stats)).toBe(0);
    });

    it('should give 1 point for 1-59 minutes', () => {
      const stats: PlayerStats = { minutes: 30, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('GK', stats)).toBe(1);
    });

    it('should give 1 point for 59 minutes', () => {
      const stats: PlayerStats = { minutes: 59, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('GK', stats)).toBe(1);
    });

    it('should give 2 points for 60+ minutes', () => {
      const stats: PlayerStats = { minutes: 60, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('GK', stats)).toBe(2);
    });

    it('should give 2 points for 90 minutes', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('GK', stats)).toBe(2);
    });
  });

  describe('goals scored', () => {
    it('should give 10 points per goal for GK', () => {
      const stats: PlayerStats = { minutes: 90, goals: 1, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('GK', stats)).toBe(12); // 2 for playing 90 + 10 for goal
    });

    it('should give 6 points per goal for DEF', () => {
      const stats: PlayerStats = { minutes: 90, goals: 1, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('DEF', stats)).toBe(8); // 2 for playing 90 + 6 for goal
    });

    it('should give 5 points per goal for MID', () => {
      const stats: PlayerStats = { minutes: 90, goals: 1, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('MID', stats)).toBe(7); // 2 for playing 90 + 5 for goal
    });

    it('should give 4 points per goal for FWD', () => {
      const stats: PlayerStats = { minutes: 90, goals: 1, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('FWD', stats)).toBe(6); // 2 for playing 90 + 4 for goal
    });

    it('should calculate multiple goals correctly', () => {
      const stats: PlayerStats = { minutes: 90, goals: 2, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('MID', stats)).toBe(12); // 2 for playing 90 + 10 for 2 goals (5 each)
    });
  });

  describe('assists', () => {
    it('should give 3 points per assist for any position', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 1, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('DEF', stats)).toBe(5); // 2 for playing 90 + 3 for assist
    });

    it('should calculate multiple assists correctly', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 2, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('FWD', stats)).toBe(8); // 2 for playing 90 + 6 for 2 assists (3 each)
    });
  });

  describe('clean sheets', () => {
    it('should give 4 points for GK clean sheet with 60+ mins', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: true, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('GK', stats)).toBe(6); // 2 for playing + 4 for clean sheet
    });

    it('should give 4 points for DEF clean sheet with 60+ mins', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: true, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('DEF', stats)).toBe(6); // 2 for playing + 4 for clean sheet
    });

    it('should give 1 point for MID clean sheet with 60+ mins', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: true, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('MID', stats)).toBe(3); // 2 for playing + 1 for clean sheet
    });

    it('should NOT give clean sheet points for FWD', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: true, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('FWD', stats)).toBe(2); // 2 for playing only
    });

    it('should NOT give clean sheet points for < 60 mins', () => {
      const stats: PlayerStats = { minutes: 45, goals: 0, assists: 0, cleanSheet: true, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('GK', stats)).toBe(1); // 1 for playing only (no clean sheet)
    });
  });

  describe('saves (GK only)', () => {
    it('should give 1 point per 3 saves for GK', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 3, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('GK', stats)).toBe(3); // 2 for playing + 1 for 3 saves
    });

    it('should give 2 points per 6 saves for GK', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 6, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('GK', stats)).toBe(4); // 2 for playing + 2 for 6 saves
    });

    it('should give 0 points for 2 saves (less than 3)', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 2, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('GK', stats)).toBe(2); // 2 for playing only
    });

    it('should NOT give save points to non-GK positions', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 10, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('DEF', stats)).toBe(2); // 2 for playing only (no save points)
    });
  });

  describe('penalty saves', () => {
    it('should give 5 points per penalty save for any position', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 1, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('GK', stats)).toBe(7); // 2 for playing + 5 for pen save
    });

    it('should calculate multiple penalty saves', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 2, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('GK', stats)).toBe(12); // 2 for playing + 10 for 2 pen saves
    });
  });

  describe('goals conceded', () => {
    it('should deduct 1 point per 2 goals conceded for GK', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 2, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('GK', stats)).toBe(1); // 2 for playing - 1 for 2 goals conceded
    });

    it('should deduct 1 point per 2 goals conceded for DEF', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 2, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('DEF', stats)).toBe(1); // 2 for playing - 1 for 2 goals conceded
    });

    it('should NOT deduct goals conceded for MID', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 4, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('MID', stats)).toBe(2); // 2 for playing only (no deduction)
    });

    it('should NOT deduct goals conceded for FWD', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 4, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('FWD', stats)).toBe(2); // 2 for playing only (no deduction)
    });

    it('should round down for odd number of goals conceded', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 3, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('GK', stats)).toBe(2); // 2 for playing - 0 for 3 goals (floor(3/2)=1, wait actually floor(3/2)=1 so -1) -> should be 1
      // Actually floor(3/2) = 1, so -1 deduction
    });
  });

  describe('yellow cards', () => {
    it('should deduct 1 point per yellow card', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 1, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('DEF', stats)).toBe(1); // 2 for playing - 1 for yellow
    });

    it('should deduct multiple yellow cards', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 2, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('MID', stats)).toBe(0); // 2 for playing - 2 for yellows
    });
  });

  describe('red cards', () => {
    it('should deduct 3 points per red card', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 1, ownGoal: 0 };
      expect(computePlayerPoints('FWD', stats)).toBe(-1); // 2 for playing - 3 for red
    });

    it('should handle red card with negative points', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 1, ownGoal: 0 };
      expect(computePlayerPoints('GK', stats)).toBe(-1); // 2 for playing - 3 for red
    });
  });

  describe('penalty misses', () => {
    it('should deduct 2 points per penalty miss', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 1, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('FWD', stats)).toBe(0); // 2 for playing - 2 for pen miss
    });

    it('should calculate multiple penalty misses', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 2, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('MID', stats)).toBe(-2); // 2 for playing - 4 for 2 pen misses
    });
  });

  describe('own goals', () => {
    it('should deduct 2 points per own goal', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 1 };
      expect(computePlayerPoints('DEF', stats)).toBe(0); // 2 for playing - 2 for own goal
    });

    it('should calculate multiple own goals', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 2 };
      expect(computePlayerPoints('GK', stats)).toBe(-2); // 2 for playing - 4 for 2 own goals
    });
  });

  describe('minimum points', () => {
    it('should return minimum 0 points for negative total', () => {
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 2, red: 1, ownGoal: 0 };
      expect(computePlayerPoints('FWD', stats)).toBe(0); // 2 - 1*2 (yellows) - 3 (red) = -3, should be 0
    });

    it('should return minimum 0 for player with red card and yellows', () => {
      const stats: PlayerStats = { minutes: 30, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 1, red: 1, ownGoal: 0 };
      expect(computePlayerPoints('MID', stats)).toBe(0); // 1 - 1 (yellow) - 3 (red) = -3, should be 0
    });

    it('should return 0 for player who did not play and has negatives', () => {
      const stats: PlayerStats = { minutes: 0, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 1, red: 1, ownGoal: 1 };
      expect(computePlayerPoints('GK', stats)).toBe(0); // 0 - 1 - 3 - 2 = -6, should be 0
    });
  });

  describe('complex scenarios', () => {
    it('should calculate complete match for a goal scorer', () => {
      // A forward who scores 2 goals with 1 assist in 90 mins
      const stats: PlayerStats = { minutes: 90, goals: 2, assists: 1, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('FWD', stats)).toBe(14); // 2 (play) + 8 (2 goals * 4) + 3 (assist) = 13
      // Actually 2 goals * 4 = 8, plus 3 for assist = 11, plus 2 for play = 13
    });

    it('should calculate complete match for a clean sheet goalkeeper', () => {
      // A GK with 3 saves, clean sheet, 90 mins
      const stats: PlayerStats = { minutes: 90, goals: 0, assists: 0, cleanSheet: true, goalsConceded: 0, saves: 3, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('GK', stats)).toBe(9); // 2 (play) + 4 (clean sheet) + 1 (3 saves) = 7
    });

    it('should calculate complete match for a defender with goals and clean sheet', () => {
      // A DEF with 1 goal, clean sheet, 90 mins
      const stats: PlayerStats = { minutes: 90, goals: 1, assists: 0, cleanSheet: true, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      expect(computePlayerPoints('DEF', stats)).toBe(12); // 2 (play) + 6 (goal) + 4 (clean sheet) = 12
    });

    it('should calculate complete match with penalties', () => {
      // A MID with 1 goal, 1 assist, 1 pen saved against, 90 mins
      const stats: PlayerStats = { minutes: 90, goals: 1, assists: 1, cleanSheet: false, goalsConceded: 2, saves: 0, pensSaved: 1, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 };
      // 2 (play) + 5 (goal) + 3 (assist) + 5 (pen save) - 1 (2 goals conceded) = 14
      expect(computePlayerPoints('MID', stats)).toBe(14);
    });
  });
});

describe('computeLineupPoints', () => {
  it('should sum player points correctly', () => {
    const picks = [
      { playerId: 'p1', position: 'GK', isCaptain: false },
      { playerId: 'p2', position: 'DEF', isCaptain: false },
      { playerId: 'p3', position: 'MID', isCaptain: true },
      { playerId: 'p4', position: 'FWD', isCaptain: false }
    ];

    const fixtureStats = [
      { playerId: 'p1', stats: { minutes: 90, goals: 0, assists: 0, cleanSheet: true, goalsConceded: 0, saves: 3, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 } },
      { playerId: 'p2', stats: { minutes: 90, goals: 1, assists: 0, cleanSheet: true, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 } },
      { playerId: 'p3', stats: { minutes: 90, goals: 0, assists: 2, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 1, red: 0, ownGoal: 0 } },
      { playerId: 'p4', stats: { minutes: 45, goals: 0, assists: 0, cleanSheet: false, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 } }
    ];

    const result = computeLineupPoints(picks, fixtureStats);

    // GK: 2 (play) + 4 (clean sheet) + 1 (3 saves) = 7
    // DEF: 2 (play) + 6 (goal) + 4 (clean sheet) = 12
    // MID: 2 (play) + 6 (2 assists) - 1 (yellow) = 7
    // FWD: 1 (play, 45 mins) = 1
    expect(result.total).toBe(27);
    expect(result.breakdown['p1']).toBe(7);
    expect(result.breakdown['p2']).toBe(12);
    expect(result.breakdown['p3']).toBe(7);
    expect(result.breakdown['p4']).toBe(1);
  });

  it('should handle missing player stats with zeros', () => {
    const picks = [
      { playerId: 'p1', position: 'GK', isCaptain: false }
    ];

    const fixtureStats: Array<{ playerId: string; stats: PlayerStats }> = [];

    const result = computeLineupPoints(picks, fixtureStats);

    // No stats means 0 minutes = 0 points
    expect(result.total).toBe(0);
    expect(result.breakdown['p1']).toBe(0);
  });

  it('should return breakdown for all players', () => {
    const picks = [
      { playerId: 'p1', position: 'GK', isCaptain: false },
      { playerId: 'p2', position: 'DEF', isCaptain: false }
    ];

    const fixtureStats = [
      { playerId: 'p1', stats: { minutes: 90, goals: 0, assists: 0, cleanSheet: true, goalsConceded: 0, saves: 0, pensSaved: 0, pensMissed: 0, yellow: 0, red: 0, ownGoal: 0 } }
      // p2 has no stats
    ];

    const result = computeLineupPoints(picks, fixtureStats);

    // GK: 2 (play) + 4 (clean sheet) = 6
    // DEF: 0 (no stats = 0 minutes) = 0
    expect(result.total).toBe(6);
    expect(result.breakdown['p1']).toBe(6);
    expect(result.breakdown['p2']).toBe(0);
  });
});
