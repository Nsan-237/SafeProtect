import { Router } from 'express';
import * as messagesController from '../controllers/messages.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.post('/', messagesController.send);
router.get('/threads', messagesController.getThreads);
router.get('/:userId', messagesController.getConversation);
router.put('/:id/read', messagesController.markRead);

export default router;
