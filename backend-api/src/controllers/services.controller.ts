import { Request, Response } from 'express';
import prisma from '../config/database';

export const create = async (req: Request, res: Response) => {
  try {
    const srv = await prisma.service.create({ data: req.body });
    res.status(201).json(srv);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const srvs = await prisma.service.findMany();
    res.json(srvs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getByOrganization = async (req: Request, res: Response) => {
  try {
    const srvs = await prisma.service.findMany({ where: { organizationId: req.params.orgId } });
    res.json(srvs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const srv = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!srv) return res.status(404).json({ error: 'Service not found' });
    res.json(srv);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const srv = await prisma.service.update({ where: { id: req.params.id }, data: req.body });
    res.json(srv);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
