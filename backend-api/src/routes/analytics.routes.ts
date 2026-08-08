import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

// Dashboard stats accessible to all authenticated users (admins, workers, victims)
router.get('/dashboard', analyticsController.getDashboardStats);

// More detailed analytics only for admin/social-worker
router.get('/reports-by-time', authorize([Role.ADMIN, Role.SOCIAL_WORKER]), analyticsController.getReportsByTime);
router.get('/reports-by-category', authorize([Role.ADMIN, Role.SOCIAL_WORKER]), analyticsController.getReportsByCategory);
router.get('/cases-by-status', authorize([Role.ADMIN, Role.SOCIAL_WORKER]), analyticsController.getCasesByStatus);

export default router;
