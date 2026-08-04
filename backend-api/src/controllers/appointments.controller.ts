import { Request, Response } from 'express';
import prisma from '../config/database';

export const create = async (req: Request, res: Response) => {
  try {
    const appt = await prisma.appointment.create({ data: req.body });
    res.status(201).json(appt);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const appts = await prisma.appointment.findMany();
    res.json(appts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const appt = await prisma.appointment.findUnique({ where: { id: req.params.id } });
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
