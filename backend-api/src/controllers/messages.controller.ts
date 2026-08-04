import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';

export const send = async (req: AuthRequest, res: Response) => {
  try {
    const msg = await prisma.message.create({
      data: {
        senderId: req.user!.id,
        receiverId: req.body.receiverId,
        content: req.body.content,
      }
    });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getThreads = async (req: AuthRequest, res: Response) => {
  try {
    const msgs = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user!.id },
          { receiverId: req.user!.id },
        ]
      },
      distinct: ['senderId', 'receiverId']
    });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getConversation = async (req: AuthRequest, res: Response) => {
  try {
    const msgs = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user!.id, receiverId: req.params.userId },
          { senderId: req.params.userId, receiverId: req.user!.id },
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const markRead = async (req: Request, res: Response) => {
  try {
    const msg = await prisma.message.update({ where: { id: req.params.id }, data: { isRead: true } });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
