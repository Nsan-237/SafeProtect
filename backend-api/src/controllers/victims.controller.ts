import { Request, Response } from 'express';
import prisma from '../config/database';

export const create = async (req: Request, res: Response) => {
  try {
    const victim = await prisma.victim.create({ data: req.body });
    res.status(201).json(victim);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const victims = await prisma.victim.findMany({ include: { user: { select: { id: true, name: true, email: true, phone: true } } } });
    res.json(victims);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const victim = await prisma.victim.findUnique({ where: { id: req.params.id }, include: { user: { select: { id: true, name: true, email: true, phone: true } } } });
    if (!victim) return res.status(404).json({ error: 'Victim not found' });
    res.json(victim);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const victim = await prisma.victim.update({ where: { id: req.params.id }, data: req.body });
    res.json(victim);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteVictim = async (req: Request, res: Response) => {
  try {
    await prisma.victim.delete({ where: { id: req.params.id } });
    res.json({ message: 'Victim deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
