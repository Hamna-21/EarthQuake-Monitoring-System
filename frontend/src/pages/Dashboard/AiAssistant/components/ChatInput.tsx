import React, { useRef, useState } from 'react';
import { Send, Square } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, onStop, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [stopSignal, setStopSignal] = useState(0);
  const [voiceStatus, setVoiceStatus] = useState('Microphone Off');
  const voiceBaseRef = useRef('');
  const submit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-2">
      <div className="flex items-center justify-between gap-3 px-1">
        <p className="text-xs font-semibold text-slate-400">Enter to send · Shift + Enter for a new line</p>
        <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wide ${voiceStatus === 'Listening' ? 'border-red-300/30 bg-red-500/10 text-red-100' : voiceStatus === 'Processing' ? 'border-amber-300/30 bg-amber-500/10 text-amber-100' : 'border-cyan-300/20 bg-cyan-400/10 text-cyan-100'}`}>{voiceStatus}</span>
      </div>
      <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-black/20 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl focus-within:border-cyan-300/30">
        <textarea
          value={input}
          rows={1}
          onChange={(e) => {
            setStopSignal((value) => value + 1);
            setVoiceStatus('Microphone Off');
            setInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Ask about earthquake risk, safety steps, seismic data, or GeoPulse tools..."
          disabled={isLoading}
          className="max-h-36 min-h-12 flex-1 resize-none rounded-xl border-0 bg-transparent px-3 py-3 text-sm font-semibold text-white outline-none placeholder:text-slate-500"
        />
        <VoiceInputButton
          disabled={isLoading}
          stopSignal={stopSignal}
          onError={setVoiceError}
          onState={setVoiceStatus}
          onBegin={() => { voiceBaseRef.current = input.trim(); }}
          onText={(text) => {
            const base = voiceBaseRef.current;
            setInput(`${base ? `${base} ` : ''}${text}`.trim());
          }}
        />
        {isLoading ? (
          <button type="button" onClick={onStop} className="inline-flex h-12 min-w-24 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-5 text-sm font-black text-white shadow-lg shadow-red-900/30 transition hover:-translate-y-0.5 hover:brightness-110">
            <Square className="h-4 w-4" /> Stop
          </button>
        ) : (
          <button type="submit" disabled={!input.trim()} className="inline-flex h-12 min-w-24 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-5 text-sm font-black text-white shadow-lg shadow-cyan-900/30 transition hover:-translate-y-0.5 hover:brightness-110 disabled:pointer-events-none disabled:opacity-40">
            <Send className="h-4 w-4" /> Send
          </button>
        )}
      </div>
      {voiceError && <p className="absolute bottom-[72px] left-4 rounded-2xl border border-red-300/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-100">{voiceError}</p>}
    </form>
  );
}
