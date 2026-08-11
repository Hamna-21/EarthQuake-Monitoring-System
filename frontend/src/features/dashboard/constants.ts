import { Clock3, Flame, Globe2, MapPin, Radio, Ruler, Waves } from 'lucide-react';

export function tierAccent(magnitude: number) {
  if (magnitude >= 6) return { text: 'text-rose-600', border: 'border-l-rose-500', chip: 'bg-rose-50 text-rose-600' };
  if (magnitude >= 5) return { text: 'text-amber-600', border: 'border-l-amber-400', chip: 'bg-amber-50 text-amber-600' };
  if (magnitude >= 3) return { text: 'text-cyan-600', border: 'border-l-cyan-400', chip: 'bg-cyan-50 text-cyan-600' };
  return { text: 'text-emerald-600', border: 'border-l-emerald-400', chip: 'bg-emerald-50 text-emerald-600' };
}

const statusPalette = [
  'bg-violet-50 text-violet-700 ring-violet-200',
  'bg-cyan-50 text-cyan-700 ring-cyan-200',
  'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'bg-amber-50 text-amber-700 ring-amber-200',
  'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200',
];

export function statusTone(status: string) {
  let hash = 0;
  for (let index = 0; index < status.length; index++) {
    hash = (hash * 31 + status.charCodeAt(index)) >>> 0;
  }
  return statusPalette[hash % statusPalette.length];
}

export const tableColumns = [
  { key: 'mag', head: 'Magnitude', icon: Flame, tone: 'text-rose-400' },
  { key: 'loc', head: 'Location', icon: MapPin, tone: 'text-cyan-400' },
  { key: 'country', head: 'Country', icon: Globe2, tone: 'text-emerald-400' },
  { key: 'depth', head: 'Depth', icon: Ruler, tone: 'text-violet-400' },
  { key: 'time', head: 'Time (UTC)', icon: Clock3, tone: 'text-amber-400' },
  { key: 'alert', head: 'Alert', icon: Radio, tone: 'text-orange-400' },
  { key: 'tsunami', head: 'Tsunami', icon: Waves, tone: 'text-blue-400' },
  { key: 'status', head: 'Status', icon: Radio, tone: 'text-fuchsia-400' },
] as const;
