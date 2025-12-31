import { withAuth } from '../../lib/middleware';
import prisma from '../../lib/prisma';

export default withAuth(async (req, res) => {
  const user = (req as any).user;

  const entry = await prisma.entry.findUnique({
    where: { userId: user.userId }
  });

  return res.status(200).json({
    id: user.userId,
    email: user.email,
    entry: entry || null
  });
});
