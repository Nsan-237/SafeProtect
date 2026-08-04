import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.use(authorize([Role.ADMIN, Role.SOCIAL_WORKER]));

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/reports-by-time', analyticsController.getReportsByTime);
router.get('/reports-by-category', analyticsController.getReportsByCategory);
router.get('/cases-by-status', analyticsController.getCasesByStatus);

export default router;
