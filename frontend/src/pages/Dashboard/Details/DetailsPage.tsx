import { AlertTriangle, BarChart3, CheckCircle2, Clock3, Compass, Database, Fingerprint, Globe2, Layers, Link as LinkIcon, Map, MapPin, Radio, RadioTower, Signal, Waves } from 'lucide-react';
import type { ReactNode } from 'react';
import { magnitudeStyle } from '../../../components/dashboard/colors';
import { countryOf } from '../../../components/dashboard/data';
import { DashboardProps } from '../../../components/dashboard/types';
import { formatAlert, formatCoords, formatDepth, formatFetchedAt, formatMagnitude, formatMagnitudeWithType, formatPlace, formatTsunami, formatUtcTime } from '../History/historyDisplay';
import DetailCard from './components/DetailCard';
import DetailsActions from './components/DetailsActions';

type Card = { icon: ReactNode; label: string; value: string; gradient: string; glow?: string };
const regionOf = (place: string) => {
  const parts = place.split(',').map((part) => part.trim()).filter(Boolean);
  return parts.length > 1 ? parts.slice(0, -1).join(', ') : place;
};

export default function DetailsPage({ earthquakes, selectedEvent }: DashboardProps) {
  const event = selectedEvent || earthquakes[0] || null;
  if (!event) return <NoSelection />;
  const place = formatPlace(event.place);
  const sourceLink = event.url ?? event.detailUrl ?? 'Not Available';
  const quickStats: Card[] = [
    { icon: <AlertTriangle className="h-4 w-4" />, label: 'Alert Status', value: formatAlert(event.alert), gradient: 'from-rose-500 via-red-600 to-orange-600' },
    { icon: <Layers className="h-4 w-4" />, label: 'Depth', value: formatDepth(event.depth), gradient: 'from-orange-500 via-amber-600 to-yellow-600' },
    { icon: <BarChart3 className="h-4 w-4" />, label: 'Magnitude Type', value: event.magType ?? 'Not Available', gradient: 'from-violet-500 via-purple-600 to-fuchsia-700' },
    { icon: <Signal className="h-4 w-4" />, label: 'Felt Reports', value: String(event.felt ?? 'Not reported'), gradient: 'from-cyan-500 via-sky-600 to-blue-700' },
    { icon: <Radio className="h-4 w-4" />, label: 'Intensity', value: String(event.mmi ?? event.cdi ?? 'Unavailable'), gradient: 'from-emerald-500 via-teal-600 to-cyan-700' },
  ];
  const detailCards: Card[] = [
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

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-fuchsia-500/20 bg-slate-950 p-6 shadow-2xl sm:p-8">
        <HeroGlow />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-serif text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-300"><RadioTower className="h-3.5 w-3.5" /> Earthquake Event Analysis</p>
            <h1 className="mt-3 max-w-4xl break-words bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300 bg-clip-text font-serif text-3xl font-black tracking-tight text-transparent lg:text-5xl">{place}</h1>
            <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-400"><MapPin className="h-4 w-4 flex-shrink-0 text-fuchsia-400" /> {formatUtcTime(event.time)}</p>
          </div>
          <div className={`flex-shrink-0 rounded-2xl border px-8 py-6 text-center shadow-xl ${magnitudeStyle(event.magnitude)}`}>
            <p className="font-serif text-[10px] font-black uppercase tracking-[0.22em] opacity-80">Magnitude</p>
            <strong className="mt-1 block text-6xl font-black tabular-nums">{formatMagnitude(event.magnitude)}</strong>
          </div>
        </div>
      </div>
      <CardGrid title="At a Glance" cards={quickStats} columns="xl:grid-cols-5" />
      <CardGrid title="Full Record" cards={detailCards} columns="xl:grid-cols-4" />
      <div className="rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-xl">
        <p className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-300"><AlertTriangle className="h-4 w-4 text-rose-400" /> Event Actions</p>
        <DetailsActions event={event} />
      </div>
    </section>
  );
}

function NoSelection() {
  return <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-12 text-center shadow-2xl"><HeroGlow /><h1 className="relative text-3xl font-black text-white">No Earthquake Selected</h1><p className="relative mt-3 text-slate-400">Select an earthquake from Feed, Map, or History.</p></section>;
}

function CardGrid({ title, cards, columns }: { title: string; cards: Card[]; columns: string }) {
  return <div><p className="mb-3 px-1 font-serif text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">{title}</p><div className={`grid gap-4 md:grid-cols-2 ${columns}`}>{cards.map((card) => <DetailCard key={card.label} {...card} />)}</div></div>;
}

function HeroGlow() {
  return <><div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" /><div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" /><div className="pointer-events-none absolute right-1/3 top-0 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" /></>;
}
