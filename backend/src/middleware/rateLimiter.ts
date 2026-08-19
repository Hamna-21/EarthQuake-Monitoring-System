import { Response, NextFunction } from 'express';

const requestStore = new Map<string, number[]>();

// Enforce a small per-user/IP sliding-window limit without affecting other API routes.
export function rateLimiter(req: any, res: Response, next: NextFunction) {
  const userId = req.user?.id || req.ip || 'anonymous';
  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  let requests = requestStore.get(userId) || [];
  requests = requests.filter((timestamp) => timestamp > oneMinuteAgo);

  if (requests.length >= 20) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
  }

  requests.push(now);
  requestStore.set(userId, requests);
  next();
}
