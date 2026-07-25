import { Router } from 'express';
import { chatController } from '../controllers/chatController';
import { authenticateToken } from '../middleware/authMiddleware';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', authenticateToken, rateLimiter, chatController);

export default router;
