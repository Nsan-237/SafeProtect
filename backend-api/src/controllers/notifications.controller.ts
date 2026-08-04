import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const notifs = await prisma.notification.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' } });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const markRead = async (req: AuthRequest, res: Response) => {
  try {
    const notif = await prisma.notification.update({ where: { id: req.params.id }, data: { isRead: true } });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const markAllRead = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.updateMany({ where: { userId: req.user!.id }, data: { isRead: true } });
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
