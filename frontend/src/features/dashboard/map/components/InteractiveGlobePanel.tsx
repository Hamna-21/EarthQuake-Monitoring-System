import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import type { Earthquake } from '@/types';
import GlobePopup from './GlobePopup';
import GlobeHoverTooltip from './GlobeHoverTooltip';
import GlobeViewControls from './GlobeViewControls';
import { countryLabels, globeAssets, groundTruthCoordinates, type View, validEvents } from './globeData';
import { createGlobeMarker, markerColor } from './globeMarkers';

const RawGlobe = Globe as any;

// Keep the Three.js material and object callbacks stable so marker updates do not recreate the globe surface.
const StableGlobe = forwardRef<any, any>((props, ref) => {
  const material = useMemo(() => new THREE.MeshPhongMaterial({ color: '#ffffff', shininess: 0, specular: new THREE.Color('#05070d'), bumpScale: 0.8 }), []);
  return <RawGlobe ref={ref} {...props} objectThreeObject={stableMarkerObject} objectLabel={stableObjectLabel} ringColor={stableRingColor} ringMaxRadius={stableRingRadius} ringPropagationSpeed={stableRingSpeed} ringRepeatPeriod={stableRingPeriod} polygonCapColor={stablePolygonCapColor} polygonSideColor={stablePolygonSideColor} polygonStrokeColor={stablePolygonStrokeColor} globeMaterial={material} polygonAltitude={0.006} polygonsTransitionDuration={0} rendererConfig={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} />;
});
const GlobeComponent = StableGlobe;

const stableMarkerObject = (item: Earthquake & { markerSelected?: boolean; markerStrongest?: boolean; markerLarge?: boolean }) => createGlobeMarker(item, Boolean(item.markerSelected), Boolean(item.markerStrongest), item.markerLarge !== false);
const stableObjectLabel = () => '';
type GlobeRing = Earthquake & { isFocus?: boolean };
const stableRingColor = (item: GlobeRing) => item.isFocus ? '#22d3ee' : markerColor(item.magnitude);
const stableRingRadius = (item: GlobeRing) => item.isFocus ? 1.25 : item.magnitude >= 6 ? 0.95 : 0.65;
const stableRingSpeed = (item: GlobeRing) => item.isFocus ? 0.3 : item.magnitude >= 6 ? 0.7 : 0.45;
const stableRingPeriod = (item: GlobeRing) => item.isFocus ? 1700 : item.magnitude >= 6 ? 2100 : 3200;
const stablePolygonCapColor = () => 'rgba(14, 165, 233, .18)';
const stablePolygonSideColor = () => 'rgba(2, 6, 23, .28)';
const stablePolygonStrokeColor = () => 'rgba(226, 232, 240, .22)';

export default function InteractiveGlobePanel({ events, onSelect, onDetails, autoRotate = true, focusLocation, focusLabel, popupMode = 'compact', view: externalView, onViewChange, legendOutside = false, bare = false, compact = false, globeHeight }: { events: Earthquake[]; onSelect: (event: Earthquake) => void; onDetails: (event: Earthquake) => void; autoRotate?: boolean; focusLocation?: { lat: number; lng: number; altitude?: number } | null; focusLabel?: string; popupMode?: 'compact' | 'historical'; view?: View; onViewChange?: (view: View) => void; legendOutside?: boolean; bare?: boolean; compact?: boolean; globeHeight?: number }) {
  const host = useRef<HTMLDivElement | null>(null);
  const globe = useRef<any>(null);
  const closeTimer = useRef<number | null>(null);
  const hoverTimer = useRef<number | null>(null);
  const rotationResumeTimer = useRef<number | null>(null);
  const [width, setWidth] = useState(640);
  const [internalView, setInternalView] = useState<View>('night');
  const [globeReady, setGlobeReady] = useState(false);
  const [selected, setSelected] = useState<Earthquake | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [closing, setClosing] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const isLive = popupMode !== 'historical';
  const view = externalView ?? internalView;
  const changeView = onViewChange ?? setInternalView;
  const shouldRotate = popupMode === 'compact' && autoRotate;
  const points = useMemo(() => limitGlobeEvents(validEvents(events), 700), [events]);
  const strongestId = useMemo(() => points.reduce<Earthquake | null>((strongest, event) => !strongest || event.magnitude > strongest.magnitude ? event : strongest, null)?.id ?? null, [points]);
  const globePoints = useMemo(() => points.map((event) => ({ ...event, lat: event.latitude, lng: event.longitude, markerSelected: selected?.id === event.id, markerStrongest: strongestId === event.id, markerLarge: popupMode !== 'historical' })), [points, popupMode, selected?.id, strongestId]);
  const hovered = useMemo(() => globePoints.find((event) => event.id === hoveredId) ?? null, [globePoints, hoveredId]);
  const pulseEvents = useMemo(() => [...globePoints].filter((event) => event.magnitude >= 6).sort((a, b) => b.magnitude - a.magnitude || Date.parse(b.time) - Date.parse(a.time)).slice(0, 12), [globePoints]);
  const activeFocus = focusLocation;
  const focusRings = useMemo<GlobeRing[]>(() => focusLocation ? [{ id: 'focus', magnitude: 0, place: focusLabel ?? 'Searched place', latitude: focusLocation.lat, longitude: focusLocation.lng, depth: 0, time: '', updatedAt: '', alert: null, tsunami: false, tsunamiCode: null, felt: null, status: 'historical', source: 'USGS', isFocus: true }] : [], [focusLabel, focusLocation]);
  const focusLabels = useMemo(() => focusLocation ? [{ text: focusLabel ?? 'Searched place', lat: focusLocation.lat, lng: focusLocation.lng }] : [], [focusLabel, focusLocation]);
  const assets = useMemo(() => globeAssets(view), [view]);

  // Resize once per container change and keep rotation/focus effects independent from marker rendering.
  useEffect(() => { if (!host.current) return undefined; const resize = () => setWidth(Math.max(280, host.current?.clientWidth ?? 720)); resize(); const observer = new ResizeObserver(resize); observer.observe(host.current); return () => observer.disconnect(); }, []);
  useEffect(() => setupControls(globe.current?.controls?.(), shouldRotate && !selected && !hovered), [width, shouldRotate, selected, hovered]);
  useEffect(() => { if (!globeReady || !activeFocus) return undefined; pauseRotation(); globe.current?.pointOfView?.({ lat: activeFocus.lat, lng: activeFocus.lng, altitude: activeFocus.altitude ?? 1.05 }, 1100); const timer = window.setTimeout(resumeRotation, 1150); return () => window.clearTimeout(timer); }, [globeReady, activeFocus?.lat, activeFocus?.lng, activeFocus?.altitude]);
  useEffect(() => { setHoveredId(null); setHoverPosition({ x: 0, y: 0 }); }, [points]);
  useEffect(() => () => { if (hoverTimer.current) window.clearTimeout(hoverTimer.current); if (closeTimer.current) window.clearTimeout(closeTimer.current); if (rotationResumeTimer.current) window.clearTimeout(rotationResumeTimer.current); }, []);

  const screenPosition = (event: Earthquake) => { const screen = globe.current?.getScreenCoords?.(event.latitude, event.longitude, 0.02); if (!screen || !Number.isFinite(screen.x) || !Number.isFinite(screen.y)) return null; const w = host.current?.clientWidth ?? width; const h = host.current?.clientHeight ?? 520; return { x: Math.min(Math.max(112, screen.x), Math.max(112, w - 112)), y: Math.min(Math.max(80, screen.y), h - 10) }; };
  const syncPopup = (event: Earthquake) => { const screen = screenPosition(event); if (!screen) return; setPopupPosition({ x: screen.x, y: Math.min(screen.y, (host.current?.clientHeight ?? 520) - 8) }); };
  const pauseRotation = () => { if (rotationResumeTimer.current) window.clearTimeout(rotationResumeTimer.current); const controls = globe.current?.controls?.(); if (controls) controls.autoRotate = false; };
  const resumeRotation = () => { if (!shouldRotate || selected || hovered) return; if (rotationResumeTimer.current) window.clearTimeout(rotationResumeTimer.current); rotationResumeTimer.current = window.setTimeout(() => { const controls = globe.current?.controls?.(); if (!selected && !hovered && controls) controls.autoRotate = true; rotationResumeTimer.current = null; }, 1400); };
  // Focus the camera and popup on the exact event coordinates supplied by the dataset.
  const focusOnEvent = (event: Earthquake) => { if (closeTimer.current) window.clearTimeout(closeTimer.current); pauseRotation(); const screen = screenPosition(event); if (screen) setPopupPosition(screen); setClosing(false); setSelected(event); onSelect(event); globe.current?.pointOfView?.({ lat: event.latitude, lng: event.longitude, altitude: 0.86 }, 700); requestAnimationFrame(() => syncPopup(event)); };
  const syncHover = (event: Earthquake) => { const screen = screenPosition(event); if (screen) setHoverPosition(screen); };
  const handleHover = (event: Earthquake | null) => { if (hoverTimer.current) window.clearTimeout(hoverTimer.current); if (event) { pauseRotation(); const id = event.id; hoverTimer.current = window.setTimeout(() => { setHoveredId((current) => current === id ? current : id); syncHover(event); }, 90); return; } hoverTimer.current = window.setTimeout(() => { setHoveredId(null); resumeRotation(); }, 150); };
  useEffect(() => { const controls = globe.current?.controls?.(); if (!controls || !shouldRotate) return undefined; const onStart = () => pauseRotation(); const onEnd = () => resumeRotation(); controls.addEventListener?.('start', onStart); controls.addEventListener?.('end', onEnd); return () => { controls.removeEventListener?.('start', onStart); controls.removeEventListener?.('end', onEnd); }; }, [globeReady, shouldRotate, selected, hovered]);
  useEffect(() => { if (!selected && !hovered) return undefined; const sync = () => { if (selected) syncPopup(selected); if (hovered) syncHover(hovered); }; const controls = globe.current?.controls?.(); requestAnimationFrame(sync); controls?.addEventListener?.('change', sync); return () => controls?.removeEventListener?.('change', sync); }, [selected, hovered, width]);
  const closePopup = () => { setClosing(true); closeTimer.current = window.setTimeout(() => { setSelected(null); setClosing(false); closeTimer.current = null; resumeRotation(); }, 180); };

  const renderedHeight = globeHeight ?? (compact || isLive ? 440 : 660);
  return <section ref={host} className={`${bare ? '' : 'geo-map-panel-shell'} relative w-full ${renderedHeight <= 440 ? 'min-h-[440px]' : 'min-h-[660px]'}`}>
    <div className="absolute left-0 top-0 z-20"><p className="flex items-center gap-1.5 font-serif text-[10px] font-black uppercase tracking-[0.18em] text-orange-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" /> Interactive Earth</p><p className="mt-0.5 font-serif text-[11px] font-semibold text-slate-400">{points.length} markers · drag to rotate · scroll to zoom</p></div>
    <GlobeComponent ref={globe} width={width} height={renderedHeight} backgroundColor="#030817" globeImageUrl={assets.image} bumpImageUrl={assets.bump} showAtmosphere atmosphereColor={view === 'night' ? '#64748c' : view === 'terrain' ? '#f59e0b' : '#38bdf8'} atmosphereAltitude={view === 'night' ? 0.1 : 0.14} objectsData={globePoints} objectLat="lat" objectLng="lng" objectAltitude={isLive ? 0.009 : 0.007} objectFacesSurface objectThreeObject={(item: Earthquake & { markerLarge?: boolean }) => createGlobeMarker(item, selected?.id === item.id, strongestId === item.id, item.markerLarge !== false)} objectLabel={() => ''} onObjectHover={handleHover} onObjectClick={(item: Earthquake) => focusOnEvent(item)} ringsData={[...pulseEvents, ...focusRings]} ringLat="lat" ringLng="lng" ringAltitude={isLive ? 0.011 : 0.008} ringColor={(item: Earthquake) => markerColor(item.magnitude)} ringMaxRadius={(item: Earthquake) => item.magnitude >= 7 ? 2.9 : item.magnitude >= 6 ? 2.2 : 1.45} ringPropagationSpeed={(item: Earthquake) => item.magnitude >= 6 ? 0.7 : 0.45} ringRepeatPeriod={(item: Earthquake) => item.magnitude >= 6 ? 2100 : 3200} labelLat="lat" labelLng="lng" labelText="text" polygonsData={[]} polygonCapColor={stablePolygonCapColor} polygonSideColor={stablePolygonSideColor} polygonStrokeColor={stablePolygonStrokeColor} polygonAltitude={0.0015} labelsData={[...countryLabels, ...focusLabels]} labelAltitude={0.004} labelSize={0.65} labelDotRadius={0} labelColor={() => view === 'night' ? '#f8fafc' : '#e2e8f0'} labelResolution={2} enablePointerInteraction onGlobeReady={() => { setupControls(globe.current?.controls?.(), shouldRotate && !selected && !hovered); setGlobeReady(true); globe.current?.pointOfView?.({ lat: 20, lng: 0, altitude: isLive ? (shouldRotate ? 1.32 : 1.22) : 1.32 }, 0); verifyCoordinates(globe.current); }} animateIn />
    {hovered && <GlobeHoverTooltip event={hovered} position={hoverPosition} />}
    {!legendOutside && <GlobeViewControls view={view} onChange={changeView} />}
    {!legendOutside && <GlobeLegend />}
    {selected && <GlobePopup key={selected.id} event={selected} position={popupPosition} closing={closing} onClose={closePopup} onSelect={onSelect} onDetails={onDetails} mode={popupMode} />}
    <style>{`@keyframes globePopupIn { from { opacity: 0; transform: scale(.96) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } } @keyframes globePopupOut { from { opacity: 1; transform: scale(1) translateY(0); } to { opacity: 0; transform: scale(.94) translateY(6px); } } .scene-tooltip { background: rgba(2,6,23,.92) !important; border: 1px solid rgba(255,255,255,.14) !important; border-radius: 12px !important; color: #cbd5e1 !important; }`}</style>
  </section>;
}

function setupControls(controls: any, autoRotate: boolean) { if (!controls) return; controls.autoRotate = autoRotate; controls.autoRotateSpeed = 0.18; controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 90; controls.maxDistance = 500; }
// In development, round-trip known coordinates through the globe library to catch axis/sign mistakes early.
function verifyCoordinates(instance: any) { if (!import.meta.env.DEV || !instance?.getCoords || !instance?.toGeoCoords) return; const failed = groundTruthCoordinates.filter((item) => { const point = instance.toGeoCoords(instance.getCoords(item.lat, item.lng, 0)); return Math.abs(point.lat - item.lat) > 0.0001 || Math.abs(point.lng - item.lng) > 0.0001; }); if (failed.length) console.warn('Globe coordinate verification failed:', failed.map((item) => item.name)); }

function limitGlobeEvents(events: Earthquake[], limit: number) {
  if (events.length <= limit) return events;
  const ranked = [...events].sort((a, b) => b.magnitude - a.magnitude || Date.parse(b.time) - Date.parse(a.time));
  const important = ranked.slice(0, Math.min(80, limit));
  const remaining = ranked.slice(80);
  const step = Math.max(1, Math.ceil(remaining.length / Math.max(1, limit - important.length)));
  return [...important, ...remaining.filter((_, index) => index % step === 0)].slice(0, limit);
}

export function GlobeLegend({ outside = false }: { outside?: boolean }) {
  const items = [['< M3', 2], ['M3-3.9', 3], ['M4-4.9', 4], ['M5-5.9', 5], ['M6-6.9', 6], ['M7+', 7]] as const;
  return <div className={`${outside ? 'relative' : 'pointer-events-none absolute bottom-3 left-3 z-20'} flex max-w-full flex-wrap gap-2 rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-[10px] font-bold text-slate-300 shadow-xl backdrop-blur-xl`}>
    {items.map(([label, mag]) => <span key={label} className="flex items-center gap-1.5"><span className="relative h-4 w-3"><span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-white/90" style={{ background: markerColor(mag) }} /><span className="absolute left-1/2 top-2 h-2 w-px -translate-x-1/2 bg-slate-200" /></span>{label}</span>)}
  </div>;
}
