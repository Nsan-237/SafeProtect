import { Request, Response } from 'express';
import prisma from '../config/database';

const orgInclude = {
  services: { select: { id: true, name: true, category: true, isActive: true } },
  appointments: { select: { id: true, status: true } },
};

export const create = async (req: Request, res: Response) => {
  try {
    const org = await prisma.organization.create({ data: req.body, include: orgInclude });
    res.status(201).json(org);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const orgs = await prisma.organization.findMany({
      include: orgInclude,
      orderBy: { name: 'asc' },
    });
    res.json(orgs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: req.params.id },
      include: orgInclude,
    });
    if (!org) return res.status(404).json({ error: 'Organization not found' });
    res.json(org);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const org = await prisma.organization.update({ where: { id: req.params.id }, data: req.body });
    res.json(org);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteOrg = async (req: Request, res: Response) => {
  try {
    await prisma.organization.delete({ where: { id: req.params.id } });
    res.json({ message: 'Organization deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
