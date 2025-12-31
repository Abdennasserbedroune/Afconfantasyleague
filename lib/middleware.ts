import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './auth';

export function withAuth(
  handler: (req: NextApiRequest & { user?: any }, res: NextApiResponse) => Promise<void> | void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const user = verifyToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    (req as any).user = user;
    return handler(req as any, res);
  };
}

export function optionalAuth(req: NextApiRequest) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }

  return verifyToken(token);
}
