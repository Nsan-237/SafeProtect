import { Router } from 'express';
import * as casesController from '../controllers/cases.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.post('/', authorize([Role.ADMIN, Role.SOCIAL_WORKER]), casesController.create);
router.get('/', casesController.getAll);
router.get('/:id', casesController.getById);
router.put('/:id/assign', authorize([Role.ADMIN]), casesController.assign);
router.put('/:id/status', authorize([Role.ADMIN, Role.SOCIAL_WORKER]), casesController.updateStatus);
router.patch('/:id', authorize([Role.ADMIN, Role.SOCIAL_WORKER]), casesController.updateCase);
router.post('/:id/notes', authorize([Role.ADMIN, Role.SOCIAL_WORKER]), casesController.addNote);
router.delete('/:id', authorize([Role.ADMIN]), casesController.deleteCase);

export default router;
