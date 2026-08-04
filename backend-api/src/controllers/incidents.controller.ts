import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';
import { generateCaseNumber } from '../utils/caseNumber';

export const create = async (req: AuthRequest, res: Response) => {
  try {
    let { victimId, category, description, location, date, riskLevel, isAnonymous } = req.body;
    const evidence = req.file ? req.file.path : null;

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

    const incident = await prisma.incident.create({
      data: {
        victimId,
        category: category || 'OTHER',
        description: description || 'Reported incident',
        location: location || null,
        date: date ? new Date(date) : new Date(),
        riskLevel: riskLevel || 'HIGH',
        isAnonymous: isAnonymous === true || isAnonymous === 'true',
        evidence,
      }
    });

    const count = await prisma.case.count();
    const caseNumber = generateCaseNumber(count);
    
    const newCase = await prisma.case.create({
      data: {
        incidentId: incident.id,
        caseNumber,
        priority: riskLevel,
      }
    });

    res.status(201).json({ incident, case: newCase });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAll = async (req: Request, res: Response) => {
  const incidents = await prisma.incident.findMany();
  res.json(incidents);
};

export const getById = async (req: Request, res: Response) => {
  const incident = await prisma.incident.findUnique({ where: { id: req.params.id } });
  res.json(incident);
};

export const getByVictim = async (req: Request, res: Response) => {
  const incidents = await prisma.incident.findMany({ where: { victimId: req.params.victimId } });
  res.json(incidents);
};
