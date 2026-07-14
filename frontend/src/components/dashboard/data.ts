import { Earthquake } from '../../types';
import { EventFilters, SortState } from './types';

export const fmtDate = (time: number, tz?: string) =>
  time ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short', timeZone: tz }).format(new Date(time)) : 'Unavailable';

export const countryOf = (place: string) => {
  const parts = place.split(',').map((x) => x.trim()).filter(Boolean);
  return parts.length > 1 ? parts[parts.length - 1] : 'Not listed';
};

export const filterEvents = (events: Earthquake[], filters: EventFilters) => {
  const q = filters.query.toLowerCase().trim();
  return events.filter((e) => {
    const matchesText = !q || e.place.toLowerCase().includes(q) || e.id.toLowerCase().includes(q);
    const matchesMag = e.magnitude >= filters.minMag && e.magnitude <= filters.maxMag;
    const matchesDepth = e.depth >= filters.minDepth && e.depth <= filters.maxDepth;
    const matchesAlert = filters.alert === 'all' || (filters.alert === 'none' ? !e.alert : e.alert === filters.alert);
    const matchesTsunami = filters.tsunami === 'all' || (filters.tsunami === 'yes' ? e.tsunami === 1 : e.tsunami !== 1);
    const matchesStatus = filters.status === 'all' || e.status === filters.status;
    return matchesText && matchesMag && matchesDepth && matchesAlert && matchesTsunami && matchesStatus;
  });
};

export const sortEvents = (events: Earthquake[], sort: SortState) =>
  [...events].sort((a, b) => {
    const dir = sort.direction === 'asc' ? 1 : -1;
    const av = a[sort.key];
    const bv = b[sort.key];
    return (typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv))) * dir;
  });

export const statsFor = (events: Earthquake[]) => {
  const mags = events.map((e) => e.magnitude);
  const depths = events.map((e) => e.depth);
  const countries = new Set(events.map((e) => countryOf(e.place)).filter((x) => x !== 'Not listed'));
  const today = events.filter((e) => new Date(e.time).toDateString() === new Date().toDateString()).length;
  return {
    today,
    strongest: mags.length ? Math.max(...mags) : 0,
    avgMag: mags.length ? mags.reduce((a, b) => a + b, 0) / mags.length : 0,
    countries: countries.size,
    tsunami: events.filter((e) => e.tsunami === 1).length,
    red: events.filter((e) => e.alert === 'red').length,
    reviewed: events.filter((e) => e.status === 'reviewed').length,
    maxDepth: depths.length ? Math.max(...depths) : 0,
    minDepth: depths.length ? Math.min(...depths) : 0
  };
};

export const significant = (events: Earthquake[]) =>
  [...events].filter((e) => e.magnitude >= 4.5 || e.alert || e.tsunami === 1).sort((a, b) => b.sig - a.sig);

export const haversineKm = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) => {
  const r = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(x));
};

export const csvFor = (events: Earthquake[]) => {
  const header = ['Magnitude', 'Location', 'Country', 'UTC Time', 'Depth', 'Latitude', 'Longitude', 'Alert', 'Tsunami', 'Status', 'Event ID'];
  const rows = events.map((e) => [e.magnitude, e.place, countryOf(e.place), new Date(e.time).toISOString(), e.depth, e.latitude, e.longitude, e.alert || 'none', e.tsunami ? 'yes' : 'no', e.status, e.id]);
  return [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
};
