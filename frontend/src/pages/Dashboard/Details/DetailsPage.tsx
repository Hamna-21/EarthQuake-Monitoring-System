import { AlertTriangle, MapPin, RadioTower } from 'lucide-react';
import type { ComponentProps } from 'react';
import { magnitudeStyle } from '../../../components/dashboard/colors';
import { DashboardProps } from '../../../components/dashboard/types';
import { formatMagnitude, formatPlace, formatUtcTime, historicalNote } from '../History/historyDisplay';
import DetailCard from './components/DetailCard';
import DetailsActions from './components/DetailsActions';
import { buildDetailCards, buildQuickStats } from './detailsCards';

export default function DetailsPage({ earthquakes, selectedEvent }: DashboardProps) {
  const event = selectedEvent || earthquakes[0] || null;
  if (!event) return <NoSelection />;
  const quickStats = buildQuickStats(event);
  const detailCards = buildDetailCards(event);

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-fuchsia-500/20 bg-slate-950 p-6 shadow-2xl sm:p-8">
        <HeroGlow />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-serif text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-300">
              <RadioTower className="h-3.5 w-3.5" /> Earthquake Event Analysis
            </p>
            <h1 className="mt-3 max-w-4xl break-words bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300 bg-clip-text font-serif text-3xl font-black tracking-tight text-transparent lg:text-5xl">
              {formatPlace(event.place)}
            </h1>
            <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-400">
              <MapPin className="h-4 w-4 flex-shrink-0 text-fuchsia-400" /> {formatUtcTime(event.time)}
            </p>
            <p title={historicalNote} className="mt-3 max-w-3xl text-xs font-semibold text-slate-400">Info: {historicalNote}</p>
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
        <p className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-300">
          <AlertTriangle className="h-4 w-4 text-rose-400" /> Event Actions
        </p>
        <DetailsActions event={event} />
      </div>
    </section>
  );
}

function NoSelection() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-12 text-center shadow-2xl">
      <HeroGlow />
      <h1 className="relative text-3xl font-black text-white">No Earthquake Selected</h1>
      <p className="relative mt-3 text-slate-400">Select an earthquake from Feed, Map, or History.</p>
    </section>
  );
}

function CardGrid({ title, cards, columns }: { title: string; cards: ComponentProps<typeof DetailCard>[]; columns: string }) {
  return (
    <div>
      <p className="mb-3 px-1 font-serif text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">{title}</p>
      <div className={`grid gap-4 md:grid-cols-2 ${columns}`}>
        {cards.map((card) => <DetailCard key={card.label} {...card} />)}
      </div>
    </div>
  );
}

function HeroGlow() {
  return (
    <>
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 top-0 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />
    </>
  );
}
