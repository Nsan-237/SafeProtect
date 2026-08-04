import { Router } from 'express';
import * as appointmentsController from '../controllers/appointments.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.post('/', appointmentsController.create);
router.get('/', appointmentsController.getAll);
router.get('/:id', appointmentsController.getById);
router.put('/:id', appointmentsController.update);
router.put('/:id/accept', appointmentsController.accept);
router.put('/:id/reschedule', appointmentsController.reschedule);
router.put('/:id/complete', appointmentsController.complete);
router.delete('/:id', appointmentsController.deleteAppointment);

export default router;
