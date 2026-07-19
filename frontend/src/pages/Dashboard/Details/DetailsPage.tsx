import { AlertTriangle, MapPin, RadioTower } from 'lucide-react';
import { countryOf, fmtDate } from '../../../components/dashboard/data';
import { alertStyle, depthStyle, magnitudeStyle } from '../../../components/dashboard/colors';
import { DashboardProps } from '../../../components/dashboard/types';
import DetailCard from './components/DetailCard';
import DetailsActions from './components/DetailsActions';

function regionOf(place: string) {
  const parts = place.split(',').map((part) => part.trim()).filter(Boolean);
  return parts.length > 1 ? parts.slice(0, -1).join(', ') : place;
}

export default function DetailsPage({ earthquakes, selectedEvent }: DashboardProps) {
  const event = selectedEvent || earthquakes[0] || null;

  if (!event) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <h1 className="text-3xl font-black text-slate-950">No Earthquake Selected</h1>
        <p className="mt-3 text-slate-500">Select an earthquake from Feed, Map, or History.</p>
      </section>
    );
  }

  const detailCards = [
    { label: 'Date & Time', value: fmtDate(event.time, 'UTC') },
    { label: 'Country', value: countryOf(event.place) },
    { label: 'City / Region', value: regionOf(event.place) },
    { label: 'Coordinates', value: `${event.latitude.toFixed(4)}, ${event.longitude.toFixed(4)}` },
    { label: 'Depth', value: `${event.depth.toFixed(1)} km`, tone: 'text-orange-700' },
    { label: 'Tsunami Status', value: event.tsunami ? 'Tsunami possible' : 'No tsunami flag' },
    { label: 'Alert Level', value: event.alert ?? 'No alert' },
    { label: 'Significance', value: event.sig },
    { label: 'Status', value: event.status },
    { label: 'Data Source', value: 'Official seismic network' },
  ];

  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-br from-white via-red-50 to-orange-50 p-8 shadow-xl">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-red-300/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-red-700">
              <RadioTower className="h-4 w-4" /> Earthquake Event Analysis
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-slate-950 lg:text-6xl">
              {event.place}
            </h1>
            <p className="mt-4 flex items-center gap-2 text-slate-600">
              <MapPin className="h-4 w-4 text-red-600" /> {fmtDate(event.time, 'UTC')}
            </p>
          </div>
          <div className={`rounded-3xl border px-8 py-6 text-center ${magnitudeStyle(event.magnitude)}`}>
            <p className="text-xs font-black uppercase tracking-[0.22em] opacity-80">Magnitude</p>
            <strong className="block text-6xl font-black">{event.magnitude.toFixed(1)}</strong>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <DetailCard label="Risk Color" value={event.alert ?? 'Low Risk'} tone={alertStyle(event.alert)} />
        <DetailCard label="Depth Band" value={`${event.depth.toFixed(1)} km`} tone={depthStyle(event.depth)} />
        <DetailCard label="Magnitude Type" value={event.magType} />
        <DetailCard label="Felt Reports" value={event.felt ?? 'Not reported'} />
        <DetailCard label="Intensity" value={event.mmi ?? event.cdi ?? 'Unavailable'} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {detailCards.map((card) => <DetailCard key={card.label} {...card} />)}
      </div>

      <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur">
        <p className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
          <AlertTriangle className="h-4 w-4 text-red-600" /> Event actions
        </p>
        <DetailsActions event={event} />
      </div>
    </section>
  );
}
