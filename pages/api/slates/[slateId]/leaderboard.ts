import type { NextApiRequest, NextApiResponse } from 'next';
import { SlateLeaderboardEntry } from '@/types';

interface SlateLeaderboardResponse {
  slateName: string;
  slateDate: string;
  entries: SlateLeaderboardEntry[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SlateLeaderboardResponse>
) {
  const { slateId } = req.query;

  const mockData: SlateLeaderboardResponse = {
    slateName: `Slate ${slateId}`,
    slateDate: '2024-01-15',
    entries: [
      { rank: 1, teamName: 'Thunder FC', points: 85 },
      { rank: 2, teamName: 'Eagles United', points: 78 },
      { rank: 3, teamName: 'Lions XI', points: 72 },
      { rank: 4, teamName: 'My Awesome Team', points: 68, isMyLineup: true },
      { rank: 5, teamName: 'Champions Squad', points: 65 }
    ]
  };

  for (let i = 6; i <= 20; i++) {
    mockData.entries.push({
      rank: i,
      teamName: `Team ${i}`,
      points: Math.max(20, 60 - i * 2)
    });
  }

  res.status(200).json(mockData);
}
