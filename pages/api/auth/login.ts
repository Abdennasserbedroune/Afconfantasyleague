import prisma from '../../../lib/prisma';
import { verifyPassword, issueToken } from '../../../lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await verifyPassword(password, user.passHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Wrong password' });
    }

    const token = issueToken(user.id, user.email);
    return res.status(200).json({ token, user: { id: user.id, email: user.email } });
  } catch (e) {
    return res.status(500).json({ error: 'Login failed' });
  }
}
