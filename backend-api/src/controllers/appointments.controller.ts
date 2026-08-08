import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';
import { Role } from '@prisma/client';

const appointmentInclude = {
  victim: { include: { user: { select: { name: true, email: true } } } },
  organization: { select: { id: true, name: true, location: true } },
  socialWorker: { include: { user: { select: { name: true } } } },
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    let data = { ...req.body };
    // If a VICTIM is creating, auto-fill victimId from their profile
    if (req.user?.role === Role.VICTIM) {
      const victim = await prisma.victim.findUnique({ where: { userId: req.user.id } });
      if (!victim) return res.status(400).json({ error: 'Victim profile not found' });
      data.victimId = victim.id;
    }
    const appt = await prisma.appointment.create({ data, include: appointmentInclude });
    res.status(201).json(appt);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    let where: any = {};
    if (req.user?.role === Role.VICTIM) {
      const victim = await prisma.victim.findUnique({ where: { userId: req.user.id } });
      if (victim) where.victimId = victim.id;
    } else if (req.user?.role === Role.SOCIAL_WORKER) {
      const worker = await prisma.socialWorker.findUnique({ where: { userId: req.user.id } });
      if (worker) where.socialWorkerId = worker.id;
    }
    const appts = await prisma.appointment.findMany({
      where,
      include: appointmentInclude,
      orderBy: { date: 'asc' },
    });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const appt = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: appointmentInclude,
    });
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const appt = await prisma.appointment.update({ where: { id: req.params.id }, data: req.body });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const accept = async (req: Request, res: Response) => {
  try {
    const appt = await prisma.appointment.update({ where: { id: req.params.id }, data: { status: 'SCHEDULED' } });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const reschedule = async (req: Request, res: Response) => {
  try {
    const appt = await prisma.appointment.update({ where: { id: req.params.id }, data: { date: req.body.date, time: req.body.time } });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const complete = async (req: Request, res: Response) => {
  try {
    const appt = await prisma.appointment.update({ where: { id: req.params.id }, data: { status: 'COMPLETED' } });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    await prisma.appointment.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
