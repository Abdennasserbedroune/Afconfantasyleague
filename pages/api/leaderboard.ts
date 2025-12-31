import type { NextApiRequest, NextApiResponse } from 'next';
import { LeaderboardEntry } from '@/types';

export default function handler(req: NextApiRequest, res: NextApiResponse<LeaderboardEntry[]>) {
  const mockData: LeaderboardEntry[] = [
    {
      rank: 1,
      teamName: 'Thunder FC',
      totalPoints: 245,
      slatesPlayed: 5,
      lastUpdate: new Date().toISOString()
    },
    {
      rank: 2,
      teamName: 'Eagles United',
      totalPoints: 230,
      slatesPlayed: 5,
      lastUpdate: new Date().toISOString()
    },
    {
      rank: 3,
      teamName: 'Lions XI',
      totalPoints: 215,
      slatesPlayed: 5,
      lastUpdate: new Date().toISOString()
    },
    {
      rank: 4,
      teamName: 'My Awesome Team',
      totalPoints: 198,
      slatesPlayed: 4,
      lastUpdate: new Date().toISOString(),
      isMyTeam: true
    },
    {
      rank: 5,
      teamName: 'Champions Squad',
      totalPoints: 190,
      slatesPlayed: 5,
      lastUpdate: new Date().toISOString()
    }
  ];

  for (let i = 6; i <= 50; i++) {
    mockData.push({
      rank: i,
      teamName: `Team ${i}`,
      totalPoints: Math.max(50, 180 - i * 3),
      slatesPlayed: Math.floor(Math.random() * 5) + 1,
      lastUpdate: new Date().toISOString()
    });
  }

  res.status(200).json(mockData);
}
