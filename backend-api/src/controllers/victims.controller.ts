import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';

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
    const victims = await prisma.victim.findMany({
      include: { user: { select: { id: true, name: true, email: true, phone: true } } }
    });
    res.json(victims);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Returns the full profile of the currently authenticated victim
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const victim = await prisma.victim.findUnique({
      where: { userId: req.user!.id },
      include: { user: { select: { id: true, name: true, email: true, phone: true, avatar: true } } }
    });
    if (!victim) return res.status(404).json({ error: 'Victim profile not found' });
    res.json(victim);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const victim = await prisma.victim.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { id: true, name: true, email: true, phone: true } } }
    });
    if (!victim) return res.status(404).json({ error: 'Victim not found' });
    res.json(victim);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update the victim profile for the currently authenticated user
export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    const victim = await prisma.victim.findUnique({ where: { userId: req.user!.id } });
    if (!victim) return res.status(404).json({ error: 'Victim profile not found' });
    const { age, gender, location, emergencyContact, address } = req.body;
    const updated = await prisma.victim.update({
      where: { id: victim.id },
      data: { age, gender, location, emergencyContact, address },
    });
    // Also update user-level fields if provided
    if (req.body.name || req.body.phone) {
      await prisma.user.update({
        where: { id: req.user!.id },
        data: {
          ...(req.body.name && { name: req.body.name }),
          ...(req.body.phone && { phone: req.body.phone }),
        }
      });
    }
    res.json(updated);
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
