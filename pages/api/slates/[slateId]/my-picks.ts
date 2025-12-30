import type { NextApiRequest, NextApiResponse } from 'next';
import { Player } from '@/types';

interface PicksResponse {
  slateId: string;
  slateName: string;
  status: 'OPEN' | 'LOCKED' | 'SCORED';
  players: Player[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse<PicksResponse>) {
  const { slateId } = req.query;

  const status: PicksResponse['status'] = String(slateId) === '4' ? 'OPEN' : 'SCORED';

  const players: Player[] = [
    { id: 'gk1', name: 'Goalkeeper One', team: 'Team A', position: 'GK', points: 6, cleanSheet: true },
    { id: 'd1', name: 'Defender One', team: 'Team A', position: 'DEF', points: 7, cleanSheet: true, assists: 1 },
    { id: 'd2', name: 'Defender Two', team: 'Team B', position: 'DEF', points: 2, yellowCards: 1 },
    { id: 'd3', name: 'Defender Three', team: 'Team C', position: 'DEF', points: 5, cleanSheet: true },
    { id: 'm1', name: 'Midfielder One', team: 'Team D', position: 'MID', points: 10, goals: 1, isCaptain: true },
    { id: 'm2', name: 'Midfielder Two', team: 'Team E', position: 'MID', points: 4, assists: 1 },
    { id: 'm3', name: 'Midfielder Three', team: 'Team F', position: 'MID', points: 3 },
    { id: 'f1', name: 'Forward One', team: 'Team G', position: 'FWD', points: 8, goals: 1 },
    { id: 'f2', name: 'Forward Two', team: 'Team H', position: 'FWD', points: 2 },
    { id: 'f3', name: 'Forward Three', team: 'Team I', position: 'FWD', points: 6, goals: 1 },
    { id: 'f4', name: 'Forward Four', team: 'Team J', position: 'FWD', points: 1 }
  ];

  res.status(200).json({
    slateId: String(slateId),
    slateName: `Slate ${slateId}`,
    status,
    players: status === 'OPEN' ? players.map((p) => ({ ...p, points: undefined })) : players
  });
}
