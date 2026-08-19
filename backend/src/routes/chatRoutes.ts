import { Router } from 'express';
import { chatController } from '../controllers/chatController';
import { authenticateToken } from '../middleware/authMiddleware';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Protect streamed AI access and limit each authenticated user before invoking the model provider.
router.post('/', authenticateToken, rateLimiter, chatController);

export default router;
