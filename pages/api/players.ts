import prisma from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const players = await prisma.player.findMany({
      where: { isActive: true },
      include: {
        team: true,
      },
      orderBy: { name: 'asc' },
    });

    const formattedPlayers = players.map((player) => ({
      id: player.id,
      name: player.name,
      team: player.team.name,
      position: player.position,
      price: player.price,
      isCaptain: false,
    }));

    return res.status(200).json(formattedPlayers);
  } catch (error) {
    console.error('Error fetching players:', error);
    return res.status(500).json({ error: 'Failed to fetch players' });
  }
}
