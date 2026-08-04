import { Router } from 'express';
import { analyticsDashboardHandler } from '../controllers/analyticsDashboardController';
import { analyticsPreviewHandler } from '../controllers/analyticsPreviewController';

const router = Router();

router.get('/preview', analyticsPreviewHandler);
router.get('/dashboard', analyticsDashboardHandler);

export default router;
