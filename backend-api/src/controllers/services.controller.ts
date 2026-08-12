import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';
import { Role } from '@prisma/client';

const serviceInclude = {
  organization: {
    select: { id: true, name: true, type: true, location: true, phone: true, email: true, description: true },
  },
};

export const create = async (req: Request, res: Response) => {
  try {
    const srv = await prisma.service.create({ data: req.body, include: serviceInclude });
    res.status(201).json(srv);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const srvs = await prisma.service.findMany({
      where: { isActive: true },
      include: serviceInclude,
      orderBy: { name: 'asc' },
    });
    res.json(srvs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getByOrganization = async (req: Request, res: Response) => {
  try {
    const srvs = await prisma.service.findMany({
      where: { organizationId: req.params.orgId },
      include: serviceInclude,
    });
    res.json(srvs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const srv = await prisma.service.findUnique({ where: { id: req.params.id }, include: serviceInclude });
    if (!srv) return res.status(404).json({ error: 'Service not found' });
    res.json(srv);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const srv = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!srv) return res.status(404).json({ error: 'Service not found' });

    // Ownership: ORGANIZATION users can only update their own services
    if (req.user?.role === Role.ORGANIZATION) {
      const org = await prisma.organization.findUnique({ where: { userId: req.user.id } });
      if (!org || srv.organizationId !== org.id) {
        return res.status(403).json({ error: 'Forbidden: You can only update your own organization\'s services' });
      }
    }

    const updated = await prisma.service.update({ where: { id: req.params.id }, data: req.body });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteService = async (req: AuthRequest, res: Response) => {
  try {
    const srv = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!srv) return res.status(404).json({ error: 'Service not found' });

    // Ownership: ORGANIZATION users can only delete their own services
    if (req.user?.role === Role.ORGANIZATION) {
      const org = await prisma.organization.findUnique({ where: { userId: req.user.id } });
      if (!org || srv.organizationId !== org.id) {
        return res.status(403).json({ error: 'Forbidden: You can only delete your own organization\'s services' });
      }
    }

    await prisma.service.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
