import { Request, Response } from 'express';

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

  if (!req.path.includes('ready') && !verifyAuthorizationHeader(req)) {
    return res.status(403).json({ error: 'No auth token provided' });
  }

  next();
}

function verifyAuthorizationHeader(req: Request): boolean {
  const authHeader: string = req.header('Authorization');
  const authParts: string[] = authHeader ? authHeader.split(' ') : [];

  // Ensure preflight requests are accepted
  return (
    authHeader &&
    ((authParts[0] === 'Bearer' &&
      authParts[1] === process.env.AUTHORIZATION_KEY) || authParts[0] === process.env.AUTHORIZATION_KEY)
  );;
}
