import prisma from '../../../lib/prisma';
import { hashPassword, issueToken } from '../../../lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: 'Email and password (min 8 chars) required' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  try {
    const passHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passHash }
    });

    const token = issueToken(user.id, user.email);
    return res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (e) {
    return res.status(500).json({ error: 'Signup failed' });
  }
}
