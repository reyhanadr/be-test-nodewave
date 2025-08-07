import jwt from 'jsonwebtoken';
import { UserJWTDAO } from '../entities/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

export function generateToken(user: UserJWTDAO): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token: string): UserJWTDAO | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserJWTDAO;
    return decoded;
  } catch (error) {
    return null;
  }
}
