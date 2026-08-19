import { DivIcon, LatLngBounds, Popup as LeafletPopup } from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Earthquake } from '@/types';
import { markerColor, markerSize } from '@/features/dashboard/map/components/markerDesign';
import { FlyTarget } from '@/features/dashboard/map/components/MapCanvas';

// Shared Leaflet runtime helpers keep bounds, fly-to behavior, marker sizing, and popup repositioning consistent.
export function FitBounds({ events, locationBounds }: { events: Earthquake[]; locationBounds?: { south: number; north: number; west: number; east: number } | null }) {
  const map = useMap();
  useEffect(() => {
    const bounds = locationBounds
      ? new LatLngBounds([[locationBounds.south, locationBounds.west], [locationBounds.north, locationBounds.east]])
      : events.length ? new LatLngBounds(events.map((e) => [e.latitude, e.longitude] as [number, number])) : null;
    if (!bounds?.isValid()) return;
    map.fitBounds(bounds, { animate: true, duration: 0.8, padding: [60, 60], maxZoom: 7 });
  }, [events, locationBounds, map]);
  return null;
}

export function ResizeMapOnContainerChange() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const resize = () => map.invalidateSize(false);
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    window.setTimeout(resize, 150);
    return () => observer.disconnect();
  }, [map]);
  return null;
}

export function FlyToSelected({ event }: { event?: Earthquake | null }) {
  const map = useMap();
  useEffect(() => {
    if (event) map.flyTo([event.latitude, event.longitude], Math.max(map.getZoom(), 6), { duration: 1.1 });
  }, [event, map]);
  return null;
}

export function FlyToTarget({ target }: { target?: FlyTarget | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], target.zoom ?? Math.max(map.getZoom(), 10), { duration: 1.2 });
  }, [target, map]);
  return null;
}

export function userLocationIcon() {
  return new DivIcon({
    className: '',
    html: '<span class="relative block h-5 w-5"><span class="absolute inset-0 rounded-full bg-cyan-400/40 animate-ping"></span><span class="absolute inset-[5px] rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_10px_#22d3ee]"></span></span>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

export function searchPinIcon() {
  return new DivIcon({
    className: '',
    html: '<span class="relative block h-8 w-8 -translate-y-2"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8z" fill="#e879f9"/><circle cx="12" cy="10" r="3.2" fill="white"/></svg></span>',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
}

export function quakePinIcon(event: Earthquake, isStrongest = false, compact = false) {
  // Build a compact SVG marker whose size and pulse are controlled by magnitude and selection state.
  const color = isStrongest ? '#ef4444' : markerColor(event.magnitude);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 640px)').matches;
  const size = markerSize(event.magnitude, isStrongest, compact);
  const stem = Math.round(size * 0.82);
  const pulse = event.magnitude >= 7 || isStrongest;
  const id = event.id.replace(/[^a-zA-Z0-9]/g, '');
  return new DivIcon({
    className: '',
    html: `<span class="quake-pin-wrap quake-tack-wrap" style="width:${size}px;height:${size + stem}px">${!reducedMotion && pulse ? `<span class="quake-pin-pulse" style="background:${color}"></span>` : ''}<svg class="quake-tack-svg" viewBox="0 0 44 68" aria-hidden="true"><defs><radialGradient id="tackGrad${id}" cx="32%" cy="24%" r="72%"><stop stop-color="#fff" stop-opacity=".8"/><stop offset=".22" stop-color="${color}"/><stop offset="1" stop-color="${color}" stop-opacity=".82"/><stop offset="1" stop-color="#020617" stop-opacity=".25"/></radialGradient><linearGradient id="stemGrad${id}" x1="18" x2="26" y1="34" y2="68"><stop stop-color="#f8fafc"/><stop offset=".55" stop-color="#64748b"/><stop offset="1" stop-color="#111827"/></linearGradient></defs><path d="M20.7 35h2.6l1.1 30.5-2.4 1.8-2.4-1.8L20.7 35Z" fill="url(#stemGrad${id})"/><circle cx="22" cy="22" r="18" fill="url(#tackGrad${id})" stroke="rgba(15,23,42,.72)" stroke-width="3"/><circle cx="22" cy="22" r="19.6" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="${isStrongest ? '3' : '2'}"/><ellipse cx="15.5" cy="12" rx="5.2" ry="3.6" fill="#fff" opacity=".58"/></svg></span>`,
    iconSize: [size, size + stem],
    iconAnchor: [size / 2, size + stem - 2],
  });
}

export function quakeFlatIcon(event: Earthquake, isStrongest = false) {
  const color = isStrongest ? '#ef4444' : markerColor(event.magnitude);
  const size = Math.max(16, Math.min(26, 14 + event.magnitude * 1.4));
  return new DivIcon({
    className: '',
    html: `<span class="quake-flat-marker" style="width:${size}px;height:${size}px;${isStrongest ? 'filter:drop-shadow(0 0 8px rgba(239,68,68,.82));' : ''}"><svg viewBox="0 0 24 30" aria-hidden="true"><path d="M12 1.5C6.2 1.5 2 5.7 2 11c0 7 10 16.5 10 16.5S22 18 22 11C22 5.7 17.8 1.5 12 1.5Z" fill="${color}" stroke="#fff" stroke-width="1.7"/><circle cx="12" cy="11" r="3.4" fill="rgba(255,255,255,.28)"/></svg></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

export function tierClass(magnitude: number) {
  return magnitude >= 6 ? 'tier-high' : magnitude >= 5 ? 'tier-moderate' : 'tier-low';
}

export function repositionPopup(e: { popup: LeafletPopup }) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      e.popup?.update?.();
    });
  });
}
