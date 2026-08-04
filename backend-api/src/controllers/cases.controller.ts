import { Request, Response } from 'express';
import prisma from '../config/database';
import { generateCaseNumber } from '../utils/caseNumber';

export const create = async (req: Request, res: Response) => {
  try {
    const count = await prisma.case.count();
    const caseNumber = generateCaseNumber(count);
    const data = { ...req.body, caseNumber };
    const newCase = await prisma.case.create({ data });
    res.status(201).json(newCase);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const cases = await prisma.case.findMany({
      include: {
        incident: {
          include: {
            victim: {
              include: { user: { select: { name: true, phone: true } } },
            },
          },
        },
        assignedWorker: { include: { user: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const c = await prisma.case.findUnique({
      where: { id: req.params.id },
      include: {
        incident: {
          include: {
            victim: {
              include: { user: { select: { name: true, phone: true } } },
            },
          },
        },
        assignedWorker: { include: { user: { select: { name: true } } } },
      },
    });
    if (!c) return res.status(404).json({ error: 'Case not found' });
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const assign = async (req: Request, res: Response) => {
  try {
    const c = await prisma.case.update({ where: { id: req.params.id }, data: { assignedWorkerId: req.body.workerId } });
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const c = await prisma.case.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const addNote = async (req: Request, res: Response) => {
  try {
    const c = await prisma.case.update({
      where: { id: req.params.id },
      data: { notes: req.body.notes },
    });
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateCase = async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    const data: any = {};
    if (status) data.status = status;
    if (notes !== undefined) data.notes = notes;
    const c = await prisma.case.update({ where: { id: req.params.id }, data });
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
