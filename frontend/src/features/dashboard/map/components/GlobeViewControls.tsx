import { Dropdown } from 'antd';
import type { View } from './globeData';

const labels = {
  satellite: 'Satellite',
  terrain: 'Terrain',
  night: 'Night',
} satisfies Record<'satellite' | 'terrain' | 'night', string>;
/** Compact selector for the shared globe's stable local Earth texture modes. */
export default function GlobeViewControls({
  view,
  onChange,
}: {
  view: View;
  onChange: (view: View) => void;
}) {
  const items = (Object.keys(labels) as Array<keyof typeof labels>).map((item) => ({ key: item, label: labels[item] }));
  return <div className="relative w-28 font-serif"><Dropdown menu={{ items, onClick: ({ key }) => onChange(key as View), selectedKeys: [view] }} placement="bottomRight" trigger={['click']}><button type="button" aria-label="Change globe view" className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-slate-950/85 px-2.5 py-1.5 text-[11px] font-semibold text-slate-100 shadow-lg backdrop-blur-xl transition hover:bg-white/10"><span>{labels[view]}</span><span className="text-[9px] text-slate-400">▼</span></button></Dropdown></div>;
}
