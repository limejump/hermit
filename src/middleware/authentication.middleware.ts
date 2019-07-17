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

  if (!req.path.includes('ready') && !verifyAuthroizationToken(req)) {
    return res.status(403).json({ error: 'No auth token provided' });
  }

  next();
}

function verifyAuthroizationToken(req: Request): boolean {
  const authorizationToken = process.env.AUTHORIZATION_KEY;
  const authHeader: string = req.header('Authorization');
  const authParts: string[] = authHeader ? authHeader.split(' ') : [];
  const validAuthHeader =
    Boolean(authHeader) &&
    ((authParts[0] === 'Bearer' && authParts[1] === authorizationToken) ||
      authParts[0] === authorizationToken);
  // Ensure preflight requests are accepted
  return validAuthHeader || req.param('auth') === authorizationToken;
}
