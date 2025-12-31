import prisma from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
let cachedBootstrap: any = null;
let cacheExpiry = 0;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (cachedBootstrap && Date.now() < cacheExpiry) {
    return res.status(200).json(cachedBootstrap);
  }

  try {
    const teams = await prisma.team.findMany();
    const players = await prisma.player.findMany({ where: { isActive: true } });
    const slates = await prisma.slate.findMany({
      include: { _count: { select: { fixtures: true } } }
    });

    const nextSlate = await prisma.slate.findFirst({
      where: { status: 'OPEN' },
      orderBy: { lockAt: 'asc' }
    });

    const bootstrap = {
      teams,
      players,
      slates: slates.map(s => ({
        id: s.id,
        name: s.name,
        lockAt: s.lockAt,
        status: s.status,
        fixtureCount: s._count.fixtures
      })),
      nextSlate: nextSlate ? {
        id: nextSlate.id,
        name: nextSlate.name,
        lockAt: nextSlate.lockAt
      } : null
    };

    cachedBootstrap = bootstrap;
    cacheExpiry = Date.now() + 5 * 60 * 1000;

    return res.status(200).json(bootstrap);
  } catch (e) {
    return res.status(500).json({ error: 'Bootstrap failed' });
  }
}
