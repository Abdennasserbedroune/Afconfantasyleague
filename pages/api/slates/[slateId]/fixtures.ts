import prisma from '../../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slateId } = req.query;

  if (!slateId || typeof slateId !== 'string') {
    return res.status(400).json({ error: 'Invalid slate ID' });
  }

  try {
    const fixtures = await prisma.fixture.findMany({
      where: { slateId },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: { kickoff: 'asc' },
    });

    const formattedFixtures = fixtures.map((fixture) => ({
      id: fixture.id,
      homeTeam: fixture.homeTeam.name,
      awayTeam: fixture.awayTeam.name,
      kickoff: fixture.kickoff.toISOString(),
      status: fixture.status,
    }));

    return res.status(200).json(formattedFixtures);
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
}
