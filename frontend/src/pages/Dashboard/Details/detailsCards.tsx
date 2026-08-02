import { AlertTriangle, BarChart3, CheckCircle2, Clock3, Compass, Database, Fingerprint, Globe2, Layers, Link as LinkIcon, Map, MapPin, Radio, Signal, Waves } from 'lucide-react';
import { countryOf } from '../../../components/dashboard/data';
import type { Earthquake } from '../../../types';
import { formatAlert, formatCoords, formatDepth, formatFetchedAt, formatMagnitudeWithType, formatPlace, formatTsunami, formatUtcTime } from '../History/historyDisplay';

function regionOf(place: string) {
  const parts = place.split(',').map((part) => part.trim()).filter(Boolean);
  return parts.length > 1 ? parts.slice(0, -1).join(', ') : place;
}

export function buildQuickStats(event: Earthquake) {
  return [
    { icon: <AlertTriangle className="h-4 w-4" />, label: 'Alert Status', value: formatAlert(event.alert), gradient: 'from-rose-500 via-red-600 to-orange-600' },
    { icon: <Layers className="h-4 w-4" />, label: 'Depth', value: formatDepth(event.depth), gradient: 'from-orange-500 via-amber-600 to-yellow-600' },
    { icon: <BarChart3 className="h-4 w-4" />, label: 'Magnitude Type', value: event.magType ?? 'Not Available', gradient: 'from-violet-500 via-purple-600 to-fuchsia-700' },
    { icon: <Signal className="h-4 w-4" />, label: 'Felt Reports', value: String(event.felt ?? 'Not reported'), gradient: 'from-cyan-500 via-sky-600 to-blue-700' },
    { icon: <Radio className="h-4 w-4" />, label: 'Intensity', value: String(event.mmi ?? event.cdi ?? 'Unavailable'), gradient: 'from-emerald-500 via-teal-600 to-cyan-700' },
  ];
}

export function buildDetailCards(event: Earthquake) {
  const place = formatPlace(event.place);
  const sourceLink = event.url ?? event.detailUrl ?? 'Not Available';
  return [
    { icon: <Compass className="h-4 w-4" />, label: 'UTC Time', value: formatUtcTime(event.time), gradient: 'from-cyan-400 via-sky-500 to-blue-600', glow: 'shadow-cyan-900/40' },
    { icon: <BarChart3 className="h-4 w-4" />, label: 'Magnitude', value: formatMagnitudeWithType(event), gradient: 'from-rose-400 via-orange-500 to-amber-500', glow: 'shadow-orange-900/40' },
    { icon: <Globe2 className="h-4 w-4" />, label: 'Country', value: countryOf(place), gradient: 'from-emerald-400 via-teal-500 to-cyan-500', glow: 'shadow-emerald-900/40' },
    { icon: <MapPin className="h-4 w-4" />, label: 'Place', value: place, gradient: 'from-fuchsia-400 via-pink-500 to-rose-500', glow: 'shadow-pink-900/40' },
    { icon: <MapPin className="h-4 w-4" />, label: 'City / Region', value: regionOf(place), gradient: 'from-pink-400 via-rose-500 to-red-500', glow: 'shadow-pink-900/40' },
    { icon: <Map className="h-4 w-4" />, label: 'Coordinates', value: formatCoords(event), gradient: 'from-violet-400 via-indigo-500 to-blue-600', glow: 'shadow-indigo-900/40' },
    { icon: <Layers className="h-4 w-4" />, label: 'Depth', value: formatDepth(event.depth), gradient: 'from-amber-400 via-orange-500 to-red-500', glow: 'shadow-orange-900/40' },
    { icon: <Waves className="h-4 w-4" />, label: 'Tsunami Flag', value: formatTsunami(event), gradient: event.tsunami ? 'from-blue-400 via-cyan-500 to-teal-500' : 'from-slate-400 via-slate-500 to-slate-600', glow: 'shadow-blue-900/40' },
    { icon: <AlertTriangle className="h-4 w-4" />, label: 'Alert Level', value: formatAlert(event.alert), gradient: 'from-rose-500 via-red-500 to-rose-700', glow: 'shadow-rose-900/40' },
    { icon: <Fingerprint className="h-4 w-4" />, label: 'USGS Event ID', value: event.id, gradient: 'from-purple-400 via-fuchsia-500 to-pink-500', glow: 'shadow-fuchsia-900/40' },
    { icon: <LinkIcon className="h-4 w-4" />, label: 'Original USGS Link', value: sourceLink, gradient: 'from-sky-400 via-cyan-500 to-teal-500', glow: 'shadow-cyan-900/40' },
    { icon: <CheckCircle2 className="h-4 w-4" />, label: 'Review Status', value: event.status || 'Not Available', gradient: 'from-emerald-400 via-green-500 to-teal-500', glow: 'shadow-emerald-900/40' },
    { icon: <Database className="h-4 w-4" />, label: 'Data Source', value: event.source ?? 'USGS', gradient: 'from-slate-400 via-slate-500 to-slate-600', glow: 'shadow-slate-900/40' },
    { icon: <Clock3 className="h-4 w-4" />, label: 'Last Fetched', value: formatFetchedAt(event), gradient: 'from-cyan-400 via-blue-500 to-violet-500', glow: 'shadow-cyan-900/40' },
  ];
}
