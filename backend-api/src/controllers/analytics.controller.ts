import { Request, Response } from 'express';
import prisma from '../config/database';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalReports = await prisma.incident.count();
    const activeCases = await prisma.case.count({
      where: {
        status: {
          in: ['NEW', 'UNDER_INVESTIGATION', 'SUPPORT_PROVIDED']
        }
      }
    });
    const closedCases = await prisma.case.count({
      where: {
        status: {
          in: ['RESOLVED', 'CLOSED']
        }
      }
    });
    const urgentCases = await prisma.case.count({
      where: {
        priority: 'CRITICAL'
      }
    });

    res.json({ totalReports, activeCases, closedCases, urgentCases });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getReportsByTime = async (req: Request, res: Response) => {
  // simple grouped logic for demo
  const incidents = await prisma.incident.findMany();
  const byMonth = incidents.reduce((acc: any, i) => {
    const month = i.createdAt.getMonth();
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  res.json(byMonth);
};

export const getReportsByCategory = async (req: Request, res: Response) => {
  const stats = await prisma.incident.groupBy({
    by: ['category'],
    _count: true,
  });
  res.json(stats);
};

export const getCasesByStatus = async (req: Request, res: Response) => {
  const stats = await prisma.case.groupBy({
    by: ['status'],
    _count: true,
  });
  res.json(stats);
};
