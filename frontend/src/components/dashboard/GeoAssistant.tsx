import { useState } from 'react';
import { Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { DashboardPage } from './types';

type Message = { from: 'bot' | 'user'; text: string };

const answers: Record<string, string> = {
  magnitude: 'Magnitude measures released earthquake energy. Higher values can mean stronger shaking and wider impact.',
  tsunami: 'A tsunami alert means underwater movement may have displaced ocean water. Move inland or to higher ground if advised.',
  safety: 'During shaking: drop, cover, and hold. Stay away from glass, elevators, and unstable shelves.',
};

const QUICK_REPLIES = [
  { key: 'magnitude', label: 'Magnitude', tone: 'bg-cyan-500/15 text-cyan-200 hover:bg-cyan-500/25' },
  { key: 'tsunami', label: 'Tsunami', tone: 'bg-blue-500/15 text-blue-200 hover:bg-blue-500/25' },
  { key: 'safety', label: 'Safety', tone: 'bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25' },
] as const;

export default function GeoAssistant({
  openPage,
}: {
  openPage: (page: DashboardPage) => void;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: "Hi, I'm GeoBot. Ask me about seismic risk or jump to a dashboard tool." },
  ]);

  const reply = (key: string) => {
    setMessages((current) => [
      ...current,
      { from: 'user', text: key },
      { from: 'bot', text: answers[key] },
    ]);
  };

  const go = (page: DashboardPage, text: string) => {
    openPage(page);
    setOpen(false);
    setMessages((current) => [...current, { from: 'bot', text }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl">
          {/* Panel header — small gradient badge instead of a bare icon */}
          <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-violet-600/20 px-4 py-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-900/40">
                  <Bot className="h-4 w-4 text-white" />
                </span>
                <div>
                  <p className="text-sm font-black leading-tight text-white">GeoBot</p>
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="grid h-7 w-7 place-items-center rounded-full text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-72 space-y-3 overflow-y-auto p-4 pr-3">
            {messages.map((message, index) => (
              <p
                key={index}
                className={`rounded-2xl p-3 text-sm leading-6 ${
                  message.from === 'bot'
                    ? 'bg-white/[0.06] text-slate-100'
                    : 'ml-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                }`}
              >
                {message.text}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-white/10 p-4 pt-3">
            {QUICK_REPLIES.map(({ key, label, tone }) => (
              <button
                key={key}
                onClick={() => reply(key)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${tone}`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => go('nearby', 'Opening nearby earthquake awareness.')}
              className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:brightness-110"
            >
              Nearby
            </button>
            <button
              onClick={() => go('alerts', 'Opening alert rules.')}
              className="rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:brightness-110"
            >
              Alerts
            </button>
          </div>
        </div>
      )}

      {/* Launcher — smaller, gradient ring, subtle pulse instead of a bare red dot */}
      <button
        onClick={() => setOpen((value) => !value)}
        aria-label="Open GeoBot assistant"
        className="group relative grid h-12 w-12 place-items-center rounded-full text-white shadow-lg shadow-cyan-950/40 transition-transform hover:scale-105 active:scale-95"
      >
        {/* soft breathing halo behind the button */}
        <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/30" style={{ animationDuration: '2.4s' }} />
        {/* gradient ring */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500" />
        {/* inner dark disc so icon sits on a crisp base */}
        <span className="absolute inset-[2px] rounded-full bg-slate-950" />

        <span className="relative">
          {open ? (
            <Send className="h-5 w-5 text-cyan-200" />
          ) : (
            <MessageCircle className="h-5 w-5 text-cyan-200 transition-transform group-hover:scale-110" />
          )}
        </span>

        {!open && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white ring-2 ring-white">
            <Sparkles className="h-2 w-2" />
          </span>
        )}
      </button>
    </div>
  );
}