import { AlertTriangle, BarChart3, CheckCircle2, Clock3, Compass, Fingerprint, Globe2, Layers, Map, MapPin, RadioTower, Signal, Radio, Waves } from 'lucide-react';
import type { ReactNode } from 'react';
import { magnitudeStyle } from '@/features/dashboard/utils/colors';
import { countryOf } from '@/features/dashboard/utils/data';
import { DashboardProps } from '@/features/dashboard/types';
import { formatAlert, formatCoords, formatDepth, formatFetchedAt, formatMagnitude, formatMagnitudeWithType, formatPlace, formatTsunami, formatUtcTime } from '@/features/dashboard/historical/utils/historyDisplay';
import DetailCard from '@/features/dashboard/components/DetailCard';
import DetailsActions from '@/features/dashboard/components/DetailsActions';

type Card = { icon: ReactNode; label: string; value: string; gradient: string; glow?: string };
const regionOf = (place: string) => {
  const parts = place.split(',').map((part) => part.trim()).filter(Boolean);
  return parts.length > 1 ? parts.slice(0, -1).join(', ') : place;
};

/** Presents the selected event's normalized metadata, formatted coordinates, alerts, and actions. */
export default function DetailsPage({ earthquakes, selectedEvent }: DashboardProps) {
  const event = selectedEvent || earthquakes[0] || null;
  if (!event) return <NoSelection />;
  const place = formatPlace(event.place);
  const quickStats: Card[] = [
    { icon: <AlertTriangle className="h-4 w-4" />, label: 'Alert Status', value: formatAlert(event.alert), gradient: 'from-rose-500 via-red-600 to-orange-600' },
    { icon: <BarChart3 className="h-4 w-4" />, label: 'Magnitude', value: formatMagnitudeWithType(event), gradient: 'from-rose-400 via-orange-500 to-amber-500', glow: 'shadow-orange-900/40' },
    { icon: <Layers className="h-4 w-4" />, label: 'Depth', value: formatDepth(event.depth), gradient: 'from-orange-500 via-amber-600 to-yellow-600' },
    { icon: <Signal className="h-4 w-4" />, label: 'Felt Reports', value: String(event.felt ?? 'Not reported'), gradient: 'from-cyan-500 via-sky-600 to-blue-700' },
    { icon: <Radio className="h-4 w-4" />, label: 'Intensity', value: String(event.mmi ?? event.cdi ?? 'Unavailable'), gradient: 'from-emerald-500 via-teal-600 to-cyan-700' },
  ];
  const detailCards: Card[] = [
    { icon: <Compass className="h-4 w-4" />, label: 'UTC Time', value: formatUtcTime(event.time), gradient: 'from-cyan-400 via-sky-500 to-blue-600', glow: 'shadow-cyan-900/40' },
    { icon: <Globe2 className="h-4 w-4" />, label: 'Country', value: countryOf(place), gradient: 'from-emerald-400 via-teal-500 to-cyan-500', glow: 'shadow-emerald-900/40' },
    { icon: <MapPin className="h-4 w-4" />, label: 'Place', value: place, gradient: 'from-fuchsia-400 via-pink-500 to-rose-500', glow: 'shadow-pink-900/40' },
    { icon: <MapPin className="h-4 w-4" />, label: 'City / Region', value: regionOf(place), gradient: 'from-pink-400 via-rose-500 to-red-500', glow: 'shadow-pink-900/40' },
    { icon: <Map className="h-4 w-4" />, label: 'Coordinates', value: formatCoords(event), gradient: 'from-violet-400 via-indigo-500 to-blue-600', glow: 'shadow-indigo-900/40' },
    { icon: <Waves className="h-4 w-4" />, label: 'Tsunami Flag', value: formatTsunami(event), gradient: event.tsunami ? 'from-blue-400 via-cyan-500 to-teal-500' : 'from-slate-400 via-slate-500 to-slate-600', glow: 'shadow-blue-900/40' },
    { icon: <CheckCircle2 className="h-4 w-4" />, label: 'Review Status', value: event.status || 'Not Available', gradient: 'from-emerald-400 via-green-500 to-teal-500', glow: 'shadow-emerald-900/40' },
    { icon: <Clock3 className="h-4 w-4" />, label: 'Last Fetched', value: formatFetchedAt(event), gradient: 'from-cyan-400 via-blue-500 to-violet-500', glow: 'shadow-cyan-900/40' },
  ];

  return (
    <section className="details-page">
      <div className="details-hero">
        <HeroGlow />
        <div className="details-hero__content">
          <div className="min-w-0">
            <p className="details-hero__eyebrow"><RadioTower className="details-hero__eyebrow-icon" /> Earthquake Event Analysis</p>
            <h1 className="details-hero__title">{place}</h1>
            <p className="details-hero__time"><MapPin className="details-hero__time-icon" /> {formatUtcTime(event.time)}</p>
          </div>
          <div className={`details-magnitude ${magnitudeStyle(event.magnitude)}`}>
            <p className="details-magnitude__label">Magnitude</p>
            <strong className="details-magnitude__value">{formatMagnitude(event.magnitude)}</strong>
          </div>
        </div>
      </div>
     <CardGrid title="At a Glance" cards={quickStats} columns="details-card-grid--wide" />
<CardGrid title="Full Record" cards={detailCards} columns="details-card-grid--wide" />
      <div className="details-actions-panel">
        <p className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-300"><AlertTriangle className="h-4 w-4 text-rose-400" /> Event Actions</p>
        <DetailsActions event={event} />
      </div>
    </section>
  );
}

/** Renders or coordinates no selection for this frontend module. */
function NoSelection() {
  return <section className="details-empty"><HeroGlow /><h1 className="details-empty__title">No Earthquake Selected</h1><p className="details-empty__message">Select an earthquake from Feed, Map, or History.</p></section>;
}

/** Renders or coordinates card grid for this frontend module. */
function CardGrid({ title, cards, columns }: { title: string; cards: Card[]; columns: string }) {
  return (
    <div>
      <p className="details-section-title">{title}</p>
      <div className={`details-card-grid ${columns}`}>
        {cards.map((card) => <DetailCard key={card.label} {...card} />)}
      </div>
    </div>
  );
}

/** Renders or coordinates hero glow for this frontend module. */
function HeroGlow() {
  return <><div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" /><div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" /><div className="pointer-events-none absolute right-1/3 top-0 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" /></>;
}
