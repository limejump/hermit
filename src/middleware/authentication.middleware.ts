import { Request, Response } from 'express';

import { verify } from 'jsonwebtoken';

export function authenticate(
  req: Request,
  res: Response,
  next: (err?: any) => void,
) {
  // Allow preflights through
  if (req.method === 'OPTIONS') {
    next();
    return;
  }

  if (!req.path.endsWith('/ready') && !verifyJWT(req)) {
    return res.status(401).json({ error: 'Authorization failed' });
  }

  next();
}

function verifyJWT(req: Request): boolean {
  const jwtSecret = process.env.JWT_SECRET;
  const authHeader: string = req.header('Authorization');
  const authParts: string[] = authHeader ? authHeader.split(' ') : [];

  try {
    // We check for Bearer first per the spec but traditionally Limejump auth doesn't require Bearer so we also allow that
    if (authParts[0] === 'Bearer' && authParts[1]) {
      return Boolean(verify(authParts[1], jwtSecret));
    } else {
      return Boolean(verify(authParts[0], jwtSecret));
    }
  } catch (e) {
    // Empty catch
  }

  return false;
}
