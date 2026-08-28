import { Activity, FlaskConical, Globe2, Info, Timer, TrendingUp, Users } from 'lucide-react';

export type Reliability = 'measured' | 'reported' | 'unreliable';
export interface Sign { text: string; tier: Reliability; }

export const signs: Sign[] = [
  { tier: 'measured', text: 'Small tremors or foreshocks in the days or hours before a larger earthquake, though not every earthquake has them.' },
  { tier: 'measured', text: 'Slow, gradual tilting or ground deformation near fault lines, tracked over weeks or months by tiltmeters and GPS.' },
  { tier: 'measured', text: 'Water levels in wells and springs rising, falling, or turning muddy without a clear cause.' },
  { tier: 'measured', text: 'Unusual gas emissions, such as radon, sometimes recorded near fault zones before an event.' },
  { tier: 'measured', text: 'Micro-changes in seismic wave velocity through rock, picked up by dense sensor arrays.' },
  { tier: 'measured', text: 'Clusters of repeating micro-earthquakes along a locked fault segment, seen in aftershock catalogs.' },
  { tier: 'reported', text: 'Cracks, bulges, or sudden changes in the ground surface near active fault lines.' },
  { tier: 'reported', text: 'Small landslides or rockfalls in hilly areas, which can indicate shifting ground stress.' },
  { tier: 'reported', text: 'Minor, repeated cracking sounds underground reported by residents near fault zones.' },
  { tier: 'reported', text: 'Sudden changes in spring or well water color, smell, or temperature noticed by locals.' },
  { tier: 'reported', text: 'Unexplained fluctuations in local tap water pressure in areas near active faults.' },
  { tier: 'unreliable', text: 'Livestock and wild animals behaving unusually - widely reported anecdotally, but not scientifically confirmed.' },
  { tier: 'unreliable', text: 'Slight shifts in local magnetic or electrical fields - studied, but not considered a reliable indicator.' },
  { tier: 'unreliable', text: 'Unusual cloud formations near fault lines - a folk belief with no accepted scientific backing.' },
  { tier: 'unreliable', text: '"Earthquake weather" - the idea that certain temperatures or calm skies precede earthquakes - is not supported by data.' },
];

export const tiers: Record<Reliability, { label: string; hint: string; icon: typeof Activity }> = {
  measured: { label: 'Instrument-detectable', hint: 'Tracked by seismic, geodetic, or hydrological sensors', icon: Activity },
  reported: { label: 'Resident-reported', hint: 'Anecdotal patterns near fault zones, not independently verified', icon: Users },
  unreliable: { label: 'Studied, not reliable', hint: 'Investigated by researchers but lacks predictive value', icon: FlaskConical },
};

export const order: Reliability[] = ['measured', 'reported', 'unreliable'];
export const facts = [
  { icon: Globe2, label: 'Daily activity', value: '~20K+', hint: 'Earthquakes detected worldwide per year by global seismic networks (mostly minor)', tone: 'cyan' },
  { icon: TrendingUp, label: 'Aftershock odds', value: 'High', hint: 'Most large earthquakes are followed by aftershocks, sometimes for months', tone: 'indigo' },
  { icon: Timer, label: 'Warning window', value: 'Seconds', hint: 'Early-warning systems can give seconds to tens of seconds notice, not days', tone: 'amber' },
  { icon: Info, label: 'Reliable prediction', value: 'None', hint: 'No method today reliably predicts the exact time, place, and size of an earthquake', tone: 'rose' },
];
/** Curated early-warning indicators used by the prediction guidance UI. */
