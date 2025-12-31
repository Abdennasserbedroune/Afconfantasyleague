import type { NextApiRequest, NextApiResponse } from 'next';
import { Slate } from '@/types';

export default function handler(req: NextApiRequest, res: NextApiResponse<Slate>) {
  const { slateId } = req.query;

  const slate: Slate = {
    id: String(slateId),
    name: `Slate ${slateId}`,
    lockTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    status: 'LOCKED',
    fixtures: [
      {
        id: 'f1',
        homeTeam: 'Team A',
        awayTeam: 'Team B',
        kickoff: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'FINISHED'
      },
      {
        id: 'f2',
        homeTeam: 'Team C',
        awayTeam: 'Team D',
        kickoff: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        status: 'FINISHED'
      }
    ]
  };

  res.status(200).json(slate);
}
