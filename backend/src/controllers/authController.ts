// Re-export local and Google authentication handlers from one route-facing controller module.
export { register, login, getMe } from './authLocalController';
export { getGoogleUrl, getGoogleSandbox, googleSandboxCallback, googleCallback } from './authGoogleController';
