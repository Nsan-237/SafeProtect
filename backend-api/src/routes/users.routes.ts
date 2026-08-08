import { Router } from 'express';
import * as usersController from '../controllers/users.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.get('/', authorize([Role.ADMIN]), usersController.getAll);
router.get('/:id', authorize([Role.ADMIN]), usersController.getById);
router.put('/:id', authorize([Role.ADMIN]), usersController.update);
router.delete('/:id', authorize([Role.ADMIN]), usersController.deleteUser);

export default router;
