import { Router } from 'express';
import { register, login, getMe, getGoogleUrl, getGoogleSandbox, googleSandboxCallback, googleCallback } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Local authentication endpoints and the Google OAuth hand-off share this router.
router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.get('/google/url', getGoogleUrl);
router.get('/google/sandbox', getGoogleSandbox);
router.post('/google/sandbox-callback', googleSandboxCallback);

export default router;
