import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';

export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isActive: true, phone: true, avatar: true, createdAt: true },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, name: true, email: true, role: true, isActive: true, phone: true, avatar: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { password, currentPassword, ...fields } = req.body;

    const updateData: any = { ...fields };

    // Handle password change: verify current password first
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new password.' });
      }
      const existing = await prisma.user.findUnique({ where: { id: req.params.id } });
      if (!existing) return res.status(404).json({ error: 'User not found' });

      const valid = await bcrypt.compare(currentPassword, existing.password);
      if (!valid) return res.status(401).json({ error: 'Current password is incorrect.' });

      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({ where: { id: req.params.id }, data: updateData });
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
