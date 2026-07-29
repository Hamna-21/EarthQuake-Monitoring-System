import { Earthquake } from '../../types';
import { alertStyle, depthStyle } from './colors';
import { countryOf, fmtDate } from './data';
import Badge from './Badge';
import { statusTone, tierAccent } from './tableConfig';

interface DataTableRowProps {
  event: Earthquake;
  index: number;
  onSelect: (event: Earthquake) => void;
  highlighted?: boolean;
}

export default function DataTableRow({ event, index, onSelect, highlighted = false }: DataTableRowProps) {
  const accent = tierAccent(event.magnitude);

  return (
    <tr
      onClick={() => onSelect(event)}
      className={`cursor-pointer transition hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-violet-500/10 ${highlighted ? 'bg-cyan-500/15 ring-1 ring-cyan-300/40' : index % 2 ? 'bg-white/[0.04]' : 'bg-white/[0.02]'}`}
    >
      <td className={`border-l-4 px-6 py-4 ${accent.border}`}>
        <span className={`inline-flex items-baseline gap-1 rounded-2xl px-2 py-1 ${accent.chip}`}>
          <span className={`font-serif text-xl font-black ${accent.text}`}>{event.magnitude.toFixed(1)}</span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">mag</span>
        </span>
      </td>
      <td className="px-6 py-4"><p className="truncate font-bold text-white">{event.place}</p></td>
      <td className="px-6 py-4">
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
          {countryOf(event.place)}
        </span>
      </td>
      <td className="px-6 py-4"><Badge className={depthStyle(event.depth)}>{event.depth.toFixed(1)} km</Badge></td>
      <td className="px-6 py-4"><span className="font-serif text-xs font-semibold text-violet-600">{fmtDate(event.time, 'UTC')}</span></td>
      <td className="px-6 py-4"><Badge className={alertStyle(event.alert)}>{event.alert ?? 'None'}</Badge></td>
      <td className="px-6 py-4">
        <Badge className={event.tsunami ? 'border-fuchsia-600 bg-fuchsia-100 text-fuchsia-800' : 'border-teal-600 bg-teal-100 text-teal-800'}>
          {event.tsunami ? 'Yes' : 'No'}
        </Badge>
      </td>
      <td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusTone(event.status)}`}>{event.status}</span></td>
    </tr>
  );
}


