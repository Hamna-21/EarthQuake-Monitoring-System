import { useEffect, useRef, useState } from 'react';
import { Mic, Pause, Play, Square } from 'lucide-react';

type VoiceState = 'off' | 'listening' | 'paused' | 'processing' | 'error';
type SpeechRecognitionCtor = new () => SpeechRecognition;
type SpeechRecognition = {
  lang: string; interimResults: boolean; continuous: boolean;
  start: () => void; stop: () => void; abort: () => void;
  onstart: (() => void) | null; onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onresult: ((event: { resultIndex: number; results: SpeechRecognitionResultList }) => void) | null;
};

const errorText = (error?: string) => {
  if (error === 'not-allowed' || error === 'service-not-allowed') return 'Microphone permission was denied. Please allow microphone access and try again.';
  if (error === 'network') return 'Voice recognition had a network problem. Please check your connection and try again.';
  if (error === 'no-speech') return 'No speech detected yet. I am still listening.';
  return 'Voice recognition had trouble hearing you. Please try again.';
};

export default function VoiceInputButton({ onText, onError, onState, onBegin, disabled, stopSignal }: { onText: (text: string) => void; onError: (error: string | null) => void; onState: (state: string) => void; onBegin: () => void; disabled?: boolean; stopSignal: number; }) {
  const [state, setState] = useState<VoiceState>('off');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalRef = useRef('');
  const manualRef = useRef(false);
  const pauseRef = useRef(false);
  const silenceRef = useRef<number | null>(null);

  const setVoiceState = (next: VoiceState) => {
    setState(next);
    onState(next === 'off' ? 'Microphone Off' : next[0].toUpperCase() + next.slice(1));
  };
  const clearSilence = () => { if (silenceRef.current) window.clearTimeout(silenceRef.current); silenceRef.current = null; };
  const stop = (next: VoiceState = 'off') => {
    manualRef.current = next === 'off';
    pauseRef.current = next === 'paused';
    clearSilence();
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setVoiceState(next);
  };
  const scheduleSilence = () => {
    clearSilence();
    silenceRef.current = window.setTimeout(() => stop('off'), 4000);
  };

  const start = (resume = false) => {
    if (disabled || recognitionRef.current) return;
    const ctor = ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) as SpeechRecognitionCtor | undefined;
    if (!ctor) { onError('Voice input is not supported in this browser. Try Chrome or Edge.'); setVoiceState('error'); return; }
    if (!resume) { finalRef.current = ''; onBegin(); }
    manualRef.current = false; pauseRef.current = false; onError(null);
    const recognition = new ctor();
    recognition.lang = 'en-US'; recognition.interimResults = true; recognition.continuous = true;
    recognitionRef.current = recognition;
    recognition.onstart = () => { setVoiceState('listening'); scheduleSilence(); };
    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0]?.transcript ?? '';
        if (event.results[i].isFinal) finalRef.current = `${finalRef.current} ${text}`.replace(/\s+/g, ' ').trim();
        else interim += text;
      }
      onText(`${finalRef.current} ${interim}`.replace(/\s+/g, ' ').trim());
      setVoiceState(interim ? 'listening' : 'processing');
      scheduleSilence();
    };
    recognition.onerror = (event) => {
      if (event.error !== 'no-speech') { onError(errorText(event.error)); setVoiceState('error'); manualRef.current = true; }
      else onError(errorText(event.error));
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      clearSilence();
      if (!manualRef.current && !pauseRef.current) window.setTimeout(() => start(true), 250);
    };
    try { recognition.start(); } catch { onError('Could not start the microphone. Please check browser permissions.'); setVoiceState('error'); }
  };

  useEffect(() => () => { manualRef.current = true; clearSilence(); recognitionRef.current?.abort(); window.speechSynthesis?.cancel(); }, []);
  useEffect(() => { if (state !== 'off') stop('off'); }, [stopSignal]);

  if (state === 'listening' || state === 'processing') return <div className="flex gap-2"><IconButton label="Pause voice input" onClick={() => stop('paused')} icon={<Pause className="h-4 w-4" />} /><IconButton danger label="Stop voice input" onClick={() => stop('off')} icon={<Square className="h-4 w-4" />} /></div>;
  if (state === 'paused') return <div className="flex gap-2"><IconButton label="Resume voice input" onClick={() => start(true)} icon={<Play className="h-4 w-4" />} /><IconButton danger label="Stop voice input" onClick={() => stop('off')} icon={<Square className="h-4 w-4" />} /></div>;
  return <IconButton label="Start voice input" onClick={() => start()} disabled={disabled} icon={<Mic className="h-4 w-4" />} />;
}

function IconButton({ icon, label, onClick, disabled, danger }: { icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} title={label} aria-label={label} className={`grid h-12 w-12 place-items-center rounded-2xl border text-white shadow-lg transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-40 ${danger ? 'border-red-300/20 bg-gradient-to-br from-red-600 to-orange-500 shadow-red-900/30' : 'border-cyan-300/20 bg-white/10 text-cyan-100 shadow-cyan-950/20 hover:bg-cyan-400/15'}`}>{icon}</button>;
}
