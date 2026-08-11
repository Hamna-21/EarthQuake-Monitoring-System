import { DivIcon, LatLngBounds, Popup as LeafletPopup } from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Earthquake } from '@/types';
import { markerColor } from '@/features/dashboard/map/components/mapStyles';
import { FlyTarget } from '@/features/dashboard/map/components/MapCanvas';

export function FitBounds({ events }: { events: Earthquake[] }) {
  const map = useMap();
  useEffect(() => {
    if (!events.length) return;
    const bounds = new LatLngBounds(events.map((e) => [e.latitude, e.longitude] as [number, number]));
    map.fitBounds(bounds, { animate: true, duration: 0.8, padding: [60, 60], maxZoom: 7 });
  }, [events, map]);
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

export function rippleIcon(event: Earthquake, isStrongest = false) {
  const color = isStrongest ? '#ef4444' : markerColor(event.magnitude);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 640px)').matches;
  const size = isStrongest ? Math.min(72, Math.max(34, event.magnitude * 10)) : Math.min(58, Math.max(24, event.magnitude * 8));
  return new DivIcon({
    className: '',
    html: `<span class="relative block" style="width:${size}px;height:${size}px">${reducedMotion ? '' : `<span class="absolute inset-0 rounded-full animate-ping" style="background:${color};opacity:${isStrongest ? '.38' : '.24'}"></span>`}<span class="absolute rounded-full border-2" style="inset:${isStrongest ? '20%' : '24%'};border-color:${isStrongest ? '#fff' : color};box-shadow:0 0 ${isStrongest ? '24px' : '14px'} ${color};background:${color}"></span></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
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
