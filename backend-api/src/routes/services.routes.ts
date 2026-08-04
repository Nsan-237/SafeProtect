import { Router } from 'express';
import * as servicesController from '../controllers/services.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.post('/', authorize([Role.ADMIN, Role.ORGANIZATION]), servicesController.create);
router.get('/', servicesController.getAll);
router.get('/organization/:orgId', servicesController.getByOrganization);
router.get('/:id', servicesController.getById);
router.put('/:id', authorize([Role.ADMIN, Role.ORGANIZATION]), servicesController.update);
router.delete('/:id', authorize([Role.ADMIN, Role.ORGANIZATION]), servicesController.deleteService);

export default router;
