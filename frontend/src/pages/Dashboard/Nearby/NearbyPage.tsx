import React, { useMemo, useState } from 'react';
import { LocateFixed } from 'lucide-react';
import { haversineKm } from '../../../components/dashboard/data';
import { DashboardProps } from '../../../components/dashboard/types';
import { DataTable, MetricCard } from '../../../components/dashboard/ui';
import { PageTitle } from '../../../components/dashboard/Shell';

export default function NearbyPage({ earthquakes, setSelectedId, openPage }: DashboardProps) {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const nearby = useMemo(() => {
    if (!location) return [];
    return earthquakes
      .map((e) => ({ ...e, distance: haversineKm(location, { lat: e.latitude, lon: e.longitude }) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 25);
  }, [earthquakes, location]);
  const locate = () => {
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => setError(err.message),
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };
  return (
    <>
      <PageTitle eyebrow="Nearby Earthquakes" title="Location-relevant seismic activity" subtitle="Use browser geolocation to calculate closest real USGS events and local activity context." />
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <button onClick={locate} className="flex items-center gap-2 rounded-xl bg-red-700 px-4 py-3 text-sm font-black text-white hover:bg-red-800"><LocateFixed className="h-4 w-4" /> Locate me</button>
        {location && <p className="mt-3 text-sm text-slate-600">Using {location.lat.toFixed(4)}, {location.lon.toFixed(4)}</p>}
        {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
      </section>
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard label="Closest Distance" value={nearby[0] ? `${nearby[0].distance.toFixed(0)} km` : 'N/A'} help="Calculated with Haversine distance" />
        <MetricCard label="Closest Magnitude" value={nearby[0] ? `M ${nearby[0].magnitude.toFixed(1)}` : 'N/A'} help="Nearest event from loaded records" />
        <MetricCard label="Events Within 1000 km" value={nearby.filter((e) => e.distance <= 1000).length} help="Based on your browser location" />
      </section>
      <DataTable events={nearby} onSelect={(e) => { setSelectedId(e.id); openPage('details'); }} />
    </>
  );
}
