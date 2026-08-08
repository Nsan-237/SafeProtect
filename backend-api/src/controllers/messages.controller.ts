import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';

const userSelect = { id: true, name: true, email: true };

export const send = async (req: AuthRequest, res: Response) => {
  try {
    const msg = await prisma.message.create({
      data: {
        senderId: req.user!.id,
        receiverId: req.body.receiverId,
        content: req.body.content,
      },
      include: {
        sender: { select: userSelect },
        receiver: { select: userSelect },
      },
    });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getThreads = async (req: AuthRequest, res: Response) => {
  try {
    // Get all messages where this user is either sender or receiver,
    // ordered by latest first so the client can group them into threads
    const msgs = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user!.id },
          { receiverId: req.user!.id },
        ],
      },
      include: {
        sender: { select: userSelect },
        receiver: { select: userSelect },
      },
      orderBy: { createdAt: 'desc' },
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
        ],
      },
      include: {
        sender: { select: userSelect },
        receiver: { select: userSelect },
      },
      orderBy: { createdAt: 'asc' },
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
