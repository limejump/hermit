import { Request, Response } from 'express';

export function authenticate(
  req: Request,
  res: Response,
  next: (err?: any) => void,
) {
  if (!req.path.includes('ready') && !verifyAuthorizationHeader(req)) {
    return res.status(403).json({ error: 'No auth token provided' });
  }

  next();
}

function verifyAuthorizationHeader(req: Request): boolean {
  const authHeader: string = req.header('Authorization');
  const authParts: string[] = authHeader ? authHeader.split(' ') : [];
  return (
    authHeader &&
    authParts[0] === 'Bearer' &&
    authParts[1] === process.env.AUTHORIZATION_KEY &&
    process.env.NODE_ENV !== 'development'
  );
}
