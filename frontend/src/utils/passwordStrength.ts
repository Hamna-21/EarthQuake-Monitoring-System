export function calculatePasswordStrength(password: string) {
  if (!password) return { score: 0, text: 'No password', color: 'bg-red-900/20' };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score === 4) return { score, text: 'Highly Secure', color: 'bg-emerald-500 animate-pulse' };
  if (score === 3) return { score, text: 'Strong', color: 'bg-yellow-500' };
  if (score === 2) return { score, text: 'Medium', color: 'bg-orange-500' };
  return { score, text: 'Weak', color: 'bg-red-600' };
}
