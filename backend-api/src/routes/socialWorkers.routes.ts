import { Router } from 'express';
import * as socialWorkersController from '../controllers/socialWorkers.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.post('/', authorize([Role.ADMIN]), socialWorkersController.create);
router.get('/', authorize([Role.ADMIN]), socialWorkersController.getAll);
router.get('/:id', socialWorkersController.getById);
router.put('/:id', socialWorkersController.update);
router.delete('/:id', authorize([Role.ADMIN]), socialWorkersController.deleteWorker);

export default router;
