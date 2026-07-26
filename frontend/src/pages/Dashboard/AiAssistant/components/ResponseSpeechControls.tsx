import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

export default function ResponseSpeechControls({ active, paused, onSpeak, onPause, onResume, onStop }: { active: boolean; paused: boolean; onSpeak: () => void; onPause: () => void; onResume: () => void; onStop: () => void; }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {!active && <button type="button" onClick={onSpeak} title="Listen to answer" aria-label="Listen to answer" className="inline-flex items-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-100 hover:bg-cyan-400/20"><Volume2 className="h-3.5 w-3.5" /> Listen</button>}
      {active && paused && <button type="button" onClick={onResume} title="Resume answer audio" aria-label="Resume answer audio" className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-100"><Play className="h-3.5 w-3.5" /> Resume</button>}
      {active && !paused && <button type="button" onClick={onPause} title="Pause answer audio" aria-label="Pause answer audio" className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/20 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-100"><Pause className="h-3.5 w-3.5" /> Pause</button>}
      {active && <button type="button" onClick={onStop} title="Stop answer audio" aria-label="Stop answer audio" className="inline-flex items-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-100"><VolumeX className="h-3.5 w-3.5" /> Stop</button>}
    </div>
  );
}
