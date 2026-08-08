import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import prisma from '../config/database';
import { AuthRequest } from '../types';
import { generateCaseNumber } from '../utils/caseNumber';

const incidentInclude = {
  victim: {
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  },
  case: {
    include: {
      assignedWorker: { include: { user: { select: { name: true } } } },
    },
  },
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    let { victimId, category, description, location, date, riskLevel, isAnonymous } = req.body;
    const evidence = req.file ? req.file.path : null;

    // For VICTIM role, always derive victimId from their account
    if (req.user?.role === Role.VICTIM) {
      victimId = undefined;
    }

    if (!victimId && req.user?.id) {
      let victim = await prisma.victim.findUnique({ where: { userId: req.user.id } });
      if (!victim) {
        victim = await prisma.victim.create({ data: { userId: req.user.id } });
      }
      victimId = victim.id;
    }

    if (!victimId) {
      return res.status(400).json({ error: 'Victim profile is required to report an incident' });
    }

    const priority = riskLevel || 'HIGH';
    const incident = await prisma.incident.create({
      data: {
        victimId,
        category: category || 'OTHER',
        description: description || 'Reported incident',
        location: location || null,
        date: date ? new Date(date) : new Date(),
        riskLevel: priority,
        isAnonymous: isAnonymous === true || isAnonymous === 'true',
        evidence,
      },
    });

    const count = await prisma.case.count();
    const caseNumber = generateCaseNumber(count);
    const newCase = await prisma.case.create({
      data: {
        incidentId: incident.id,
        caseNumber,
        priority,
      },
    });

    res.status(201).json({ incident, case: newCase });
  } catch (err) {
    console.error('Incident create error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const incidents = await prisma.incident.findMany({
      include: incidentInclude,
      orderBy: { createdAt: 'desc' },
    });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const incident = await prisma.incident.findUnique({
      where: { id: req.params.id },
      include: incidentInclude,
    });
    if (!incident) return res.status(404).json({ error: 'Incident not found' });
    res.json(incident);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getByVictim = async (req: Request, res: Response) => {
  try {
    const incidents = await prisma.incident.findMany({
      where: { victimId: req.params.victimId },
      include: incidentInclude,
      orderBy: { createdAt: 'desc' },
    });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
