import { Request, Response } from 'express';
import { Prisma, Role } from '@prisma/client';
import prisma from '../config/database';
import { generateCaseNumber } from '../utils/caseNumber';
import { AuthRequest } from '../types';

const getCaseScope = async (req: AuthRequest): Promise<Prisma.CaseWhereInput | null> => {
  if (!req.user) return null;

  if (req.user.role === Role.ADMIN) return {};

  if (req.user.role === Role.VICTIM) {
    const victim = await prisma.victim.findUnique({ where: { userId: req.user.id } });
    if (!victim) return null;
    return { incident: { victimId: victim.id } };
  }

  if (req.user.role === Role.SOCIAL_WORKER) {
    const worker = await prisma.socialWorker.findUnique({ where: { userId: req.user.id } });
    if (!worker) return null;
    return { assignedWorkerId: worker.id };
  }

  return null;
};

const caseInclude = {
  incident: {
    include: {
      victim: {
        include: { user: { select: { name: true, phone: true } } },
      },
    },
  },
  assignedWorker: { include: { user: { select: { name: true } } } },
};

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

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const scope = await getCaseScope(req);
    if (!scope) return res.status(403).json({ error: 'Forbidden' });

    const cases = await prisma.case.findMany({
      where: scope,
      include: caseInclude,
      orderBy: { createdAt: 'desc' },
    });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const scope = await getCaseScope(req);
    if (!scope) return res.status(403).json({ error: 'Forbidden' });

    const c = await prisma.case.findFirst({
      where: { AND: [{ id: req.params.id }, scope] },
      include: caseInclude,
    });
    if (!c) return res.status(404).json({ error: 'Case not found' });
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const assign = async (req: Request, res: Response) => {
  try {
    const worker = await prisma.socialWorker.findUnique({ where: { id: req.body.workerId } });
    if (!worker) return res.status(400).json({ error: 'Social worker not found' });

    const c = await prisma.case.update({
      where: { id: req.params.id },
      data: { assignedWorkerId: worker.id },
      include: { incident: { include: { victim: true } } },
    });

    // Create in-app notification for the assigned worker
    prisma.notification.create({
      data: {
        userId: worker.userId,
        title: 'New Case Assigned',
        message: `Case ${c.caseNumber} has been assigned to you. Please review the details.`,
        type: 'CASE_ASSIGNED',
      },
    }).catch(() => {}); // fire-and-forget

    res.json(c);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateAssignedCase = async (
  req: AuthRequest,
  res: Response,
  data: Prisma.CaseUpdateInput,
) => {
  const scope = await getCaseScope(req);
  if (!scope || req.user?.role === Role.VICTIM) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Find the case first to verify it exists and is within scope
  const existing = await prisma.case.findFirst({
    where: { AND: [{ id: req.params.id }, scope] },
  });
  if (!existing) return res.status(404).json({ error: 'Case not found' });

  const c = await prisma.case.update({
    where: { id: req.params.id },
    data,
    include: {
      ...caseInclude,
      incident: {
        include: { victim: { include: { user: { select: { id: true } } } } },
      },
    },
  });

  // Fire-and-forget notification to the victim when status changes
  if (data.status && c?.incident?.victim?.user?.id) {
    const statusLabel: Record<string, string> = {
      UNDER_INVESTIGATION: 'is now Under Investigation',
      SUPPORT_PROVIDED: 'has Support Provided',
      RESOLVED: 'has been Resolved',
      CLOSED: 'has been Closed',
    };
    const label = statusLabel[data.status as string] ?? 'has been updated';
    prisma.notification.create({
      data: {
        userId: c.incident.victim.user.id,
        title: 'Case Status Updated',
        message: `Your case ${c?.caseNumber} ${label}.`,
        type: 'CASE_STATUS_CHANGE',
      },
    }).catch(() => {});
  }

  res.json(c);
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    await updateAssignedCase(req, res, { status: req.body.status });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const addNote = async (req: AuthRequest, res: Response) => {
  try {
    await updateAssignedCase(req, res, { notes: req.body.notes });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateCase = async (req: AuthRequest, res: Response) => {
  try {
    const { status, notes, workerId } = req.body;
    const data: Prisma.CaseUpdateInput = {};
    if (status) data.status = status;
    if (notes !== undefined) data.notes = notes;
    if (workerId) {
      // Validate the social worker exists
      const worker = await prisma.socialWorker.findUnique({ where: { id: workerId } });
      if (!worker) return res.status(400).json({ error: 'Social worker not found' });
      data.assignedWorker = { connect: { id: workerId } };
    }
    await updateAssignedCase(req, res, data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteCase = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.case.delete({ where: { id: req.params.id } });
    res.json({ message: 'Case deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
