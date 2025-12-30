import type { NextApiRequest, NextApiResponse } from 'next';
import { UserTeamData } from '@/types';

export default function handler(req: NextApiRequest, res: NextApiResponse<UserTeamData>) {
  const mockData: UserTeamData = {
    totalPoints: 198,
    slatesPlayed: 4,
    entries: [
      {
        slateId: '1',
        slateName: 'Matchweek 1',
        status: 'SCORED',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        points: 75,
        picks: [],
        pickCount: 11
      },
      {
        slateId: '2',
        slateName: 'Matchweek 2',
        status: 'SCORED',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        points: 68,
        picks: [],
        pickCount: 11
      },
      {
        slateId: '3',
        slateName: 'Matchweek 3',
        status: 'LOCKED',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        picks: [],
        pickCount: 11
      },
      {
        slateId: '4',
        slateName: 'Matchweek 4',
        status: 'OPEN',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        picks: [],
        pickCount: 0
      }
    ]
  };

  res.status(200).json(mockData);
}
