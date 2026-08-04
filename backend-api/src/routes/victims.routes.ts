import { Router } from 'express';
import * as victimsController from '../controllers/victims.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.post('/', authorize([Role.ADMIN, Role.SOCIAL_WORKER]), victimsController.create);
router.get('/', authorize([Role.ADMIN, Role.SOCIAL_WORKER]), victimsController.getAll);
router.get('/:id', victimsController.getById);
router.put('/:id', victimsController.update);
router.delete('/:id', authorize([Role.ADMIN]), victimsController.deleteVictim);

export default router;
