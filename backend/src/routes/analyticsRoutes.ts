import { Router } from 'express';
import { analyticsDashboardHandler } from '../controllers/analyticsDashboardController';
import { analyticsPreviewHandler } from '../controllers/analyticsPreviewController';

const router = Router();

// Keep preview and full dashboard analytics under one API namespace.
router.get('/preview', analyticsPreviewHandler);
router.get('/dashboard', analyticsDashboardHandler);

export default router;
