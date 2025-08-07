import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

/**
 * Middleware to verify JWT token from Authorization header.
 * If valid, attaches decoded user info to req.user.
 * If invalid or missing, responds with 401 Unauthorized.
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extract token from header
  const token = authHeader.split(' ')[1];
  const user = verifyToken(token);

  // If token is invalid or expired, reject the request
  if (!user) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Attach decoded user data to request object for downstream use
  (req as any).user = user;

  // Proceed to next middleware or route handler
  next();
}

/**
 * Middleware to restrict access based on user role.
 * @param roles - array of allowed roles (e.g., ['ADMIN', 'USER'])
 * If user role not included, responds with 403 Forbidden.
 */
export function authorize(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    // Reject if no user info or user doesn't have required role
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Role is valid; proceed
    next();
  };
}
