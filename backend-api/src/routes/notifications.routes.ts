import { Router } from 'express';
import * as notificationsController from '../controllers/notifications.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', notificationsController.getAll);
router.put('/:id/read', notificationsController.markRead);
router.put('/read-all', notificationsController.markAllRead);

export default router;
