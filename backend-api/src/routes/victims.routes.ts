import { Router } from 'express';
import * as victimsController from '../controllers/victims.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);
// Current user's own profile — must be BEFORE /:id to avoid conflict
router.get('/me', victimsController.getMe);
router.put('/me', victimsController.updateMe);
router.post('/', authorize([Role.ADMIN, Role.SOCIAL_WORKER]), victimsController.create);
router.get('/', authorize([Role.ADMIN, Role.SOCIAL_WORKER]), victimsController.getAll);
router.get('/:id', victimsController.getById);
router.put('/:id', victimsController.update);
router.delete('/:id', authorize([Role.ADMIN]), victimsController.deleteVictim);

export default router;
