export function magnitudeStyle(magnitude: number) {
  if (magnitude >= 7) return 'border-red-950 bg-red-950 text-white';
  if (magnitude >= 6) return 'border-red-700 bg-red-700 text-white';
  if (magnitude >= 5) return 'border-orange-500 bg-orange-500 text-white';
  if (magnitude >= 4) return 'border-yellow-400 bg-yellow-300 text-yellow-950';
  if (magnitude >= 2) return 'border-green-500 bg-green-100 text-green-800';
  return 'border-blue-500 bg-blue-100 text-blue-800';
}

export function alertStyle(alert?: string | null) {
  if (alert === 'red') return 'border-red-500 bg-red-100 text-red-800';
  if (alert === 'orange') return 'border-orange-500 bg-orange-100 text-orange-800';
  if (alert === 'yellow') return 'border-yellow-500 bg-yellow-100 text-yellow-800';
  if (alert === 'green') return 'border-green-500 bg-green-100 text-green-800';
  return 'border-slate-300 bg-slate-100 text-slate-700';
}

export function depthStyle(depth: number) {
  if (depth <= 10) return 'border-red-500 bg-red-50 text-red-800';
  if (depth <= 50) return 'border-orange-500 bg-orange-50 text-orange-800';
  if (depth <= 150) return 'border-yellow-500 bg-yellow-50 text-yellow-800';
  if (depth <= 300) return 'border-green-500 bg-green-50 text-green-800';
  return 'border-blue-500 bg-blue-50 text-blue-800';
}

export function distanceStyle(distance: number) {
  if (distance <= 20) return 'border-green-500 bg-green-100 text-green-800';
  if (distance <= 100) return 'border-yellow-500 bg-yellow-100 text-yellow-800';
  if (distance <= 300) return 'border-orange-500 bg-orange-100 text-orange-800';
  return 'border-red-500 bg-red-100 text-red-800';
}
