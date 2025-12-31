import prisma from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const slates = await prisma.slate.findMany({
      take: 2,
      orderBy: { lockAt: 'asc' },
      include: {
        fixtures: {
          include: {
            fixture: {
              include: {
                homeTeam: true,
                awayTeam: true,
              }
            }
          }
        }
      }
    });

    const formattedSlates = slates.map(slate => ({
      id: slate.id,
      name: slate.name,
      date: slate.dateLocal,
      lockAt: slate.lockAt,
      status: slate.status,
      fixtures: slate.fixtures.map(sf => ({
        id: sf.fixture.id,
        homeTeam: sf.fixture.homeTeam.name,
        awayTeam: sf.fixture.awayTeam.name,
        kickoff: sf.fixture.kickoffAt,
        status: sf.fixture.status,
      }))
    }));

    return res.status(200).json({
      todaySlate: formattedSlates[0] || null,
      nextSlate: formattedSlates[1] || null,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch home data' });
  }
}
