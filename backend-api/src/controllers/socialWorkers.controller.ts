import { Request, Response } from 'express';
import prisma from '../config/database';

export const create = async (req: Request, res: Response) => {
  try {
    const worker = await prisma.socialWorker.create({ data: req.body });
    res.status(201).json(worker);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const workers = await prisma.socialWorker.findMany({ include: { user: { select: { id: true, name: true, email: true, phone: true, avatar: true } } } });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const worker = await prisma.socialWorker.findUnique({ where: { id: req.params.id }, include: { user: { select: { id: true, name: true, email: true, phone: true } } } });
    if (!worker) return res.status(404).json({ error: 'Social worker not found' });
    res.json(worker);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const worker = await prisma.socialWorker.update({ where: { id: req.params.id }, data: req.body });
    res.json(worker);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteWorker = async (req: Request, res: Response) => {
  try {
    await prisma.socialWorker.delete({ where: { id: req.params.id } });
    res.json({ message: 'Worker deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
