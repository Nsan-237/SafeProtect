import { Router } from 'express';
import * as organizationsController from '../controllers/organizations.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.post('/', authorize([Role.ADMIN]), organizationsController.create);
router.get('/', organizationsController.getAll);
router.get('/:id', organizationsController.getById);
router.put('/:id', authorize([Role.ADMIN, Role.ORGANIZATION]), organizationsController.update);
router.delete('/:id', authorize([Role.ADMIN]), organizationsController.deleteOrg);

export default router;
