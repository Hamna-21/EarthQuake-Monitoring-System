import { Download, ExternalLink, Share2 } from 'lucide-react';
import { Earthquake } from '../../../../types';

export default function DetailsActions({ event }: { event: Earthquake }) {
  const share = async () => {
    const text = `${event.place} - M ${event.magnitude.toFixed(1)}`;
    if (navigator.share) await navigator.share({ title: 'GeoPulse earthquake', text, url: event.url });
    else await navigator.clipboard.writeText(`${text} ${event.url}`);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(event, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `geopulse-${event.id}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button onClick={share} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
        <Share2 className="h-4 w-4" /> Share
      </button>
      <button onClick={exportJson} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50">
        <Download className="h-4 w-4" /> Export
      </button>
      {event.url && (
        <a href={event.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-800">
          <ExternalLink className="h-4 w-4" /> View Official Report
        </a>
      )}
    </div>
  );
}
