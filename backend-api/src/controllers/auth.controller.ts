import { Request, Response } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateTokens, verifyRefreshToken } from '../utils/token';
import { Role } from '@prisma/client';

// Helper to strip sensitive fields from user object
const sanitizeUser = (user: any) => {
  const { password, ...safe } = user;
  return safe;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        role: Role.VICTIM,
        victimProfile: { create: {} },
      },
      include: {
        victimProfile: true,
        socialWorkerProfile: true,
        organizationProfile: true,
      }
    });

    const tokens = generateTokens(user.id, user.role);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    res.status(201).json({ user: sanitizeUser(user), tokens });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        victimProfile: true,
        socialWorkerProfile: true,
        organizationProfile: true,
      }
    });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    const tokens = generateTokens(user.id, user.role);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    res.json({ user: sanitizeUser(user), tokens });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'No token provided' });

    const storedToken = await prisma.refreshToken.findUnique({ where: { token } });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const payload = verifyRefreshToken(token) as { id: string; role: string };
    const tokens = generateTokens(payload.id, payload.role);
    
    await prisma.refreshToken.update({
      where: { token },
      data: {
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    res.json(tokens);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  res.json({ message: 'Password reset link sent' });
};
