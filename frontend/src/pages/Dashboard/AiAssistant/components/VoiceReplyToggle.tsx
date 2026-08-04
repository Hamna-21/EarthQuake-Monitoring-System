import { Volume2 } from 'lucide-react';

export default function VoiceReplyToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} title="Toggle voice replies" aria-pressed={enabled} className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-bold transition ${enabled ? 'border-cyan-300/30 bg-cyan-400/20 text-cyan-50' : 'border-white/10 bg-white/10 text-slate-100 hover:bg-white/15'}`}>
      <Volume2 className="h-4 w-4" /> Voice Reply {enabled ? 'On' : 'Off'}
    </button>
  );
}
