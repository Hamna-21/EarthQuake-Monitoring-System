export type MagnitudeTier = '< M3' | 'M3-3.9' | 'M4-4.9' | 'M5-5.9' | 'M6-6.9' | 'M7+';
// Centralize magnitude-to-color and size rules so 2D and 3D markers share one severity scale.
const GLOBAL_MARKER_SCALE = 1.55;
const HISTORICAL_MARKER_SCALE = 1.12;

/** Renders or coordinates magnitude tier for this frontend module. */
export function magnitudeTier(magnitude: number): MagnitudeTier {
  if (magnitude >= 7) return 'M7+';
  if (magnitude >= 6) return 'M6-6.9';
  if (magnitude >= 5) return 'M5-5.9';
  if (magnitude >= 4) return 'M4-4.9';
  if (magnitude >= 3) return 'M3-3.9';
  return '< M3';
}

/** Renders or coordinates marker color for this frontend module. */
export function markerColor(magnitude: number) {
  const colors: Record<MagnitudeTier, string> = {
    '< M3': '#38d9f3',
    'M3-3.9': '#2563eb',
    'M4-4.9': '#8b5cf6',
    'M5-5.9': '#ef4444',
    'M6-6.9': '#f97316',
    'M7+': '#fde047',
  };
  return colors[magnitudeTier(magnitude)];
}

/** Renders or coordinates marker size for this frontend module. */
export function markerSize(magnitude: number, strongest = false, compact = false) {
  const base = magnitude >= 7 ? 56 : magnitude >= 6 ? 51 : magnitude >= 5 ? 47 : magnitude >= 4 ? 42 : magnitude >= 3 ? 38 : 34;
  const size = base + (strongest ? 8 : 0) - (compact ? 4 : 0);
  return Math.min(66, Math.max(compact ? 30 : 34, size));
}

/** Renders or coordinates globe marker scale for this frontend module. */
export function globeMarkerScale(magnitude: number, large = true) {
  const base = magnitude >= 7 ? 1.22 : magnitude >= 6 ? 1.08 : magnitude >= 5 ? 0.96 : magnitude >= 4 ? 0.84 : magnitude >= 3 ? 0.72 : 0.62;
  return base * (large ? GLOBAL_MARKER_SCALE : HISTORICAL_MARKER_SCALE);
}
