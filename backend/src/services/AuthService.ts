import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';

export interface TokenPayload {
  userId: string;
  email: string;
}

export class AuthService {
  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  }

  static verifyToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  }

  async register(email: string, name: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ email, name, passwordHash });

    const token = AuthService.generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return { user: user.toJSON(), token };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      throw new Error('Invalid password');
    }

    const token = AuthService.generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return { user: user.toJSON(), token };
  }

  async getUser(userId: string) {
    return await User.findById(userId);
  }
}

export const authService = new AuthService();
