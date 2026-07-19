import { useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { DashboardPage } from './types';

type Message = { from: 'bot' | 'user'; text: string };

const answers: Record<string, string> = {
  magnitude: 'Magnitude measures released earthquake energy. Higher values can mean stronger shaking and wider impact.',
  tsunami: 'A tsunami alert means underwater movement may have displaced ocean water. Move inland or to higher ground if advised.',
  safety: 'During shaking: drop, cover, and hold. Stay away from glass, elevators, and unstable shelves.',
};

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
        <div className="mb-4 w-[min(360px,calc(100vw-32px))] rounded-3xl border border-white/60 bg-slate-950/90 p-4 text-white shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-cyan-200" />
              <span className="font-black">GeoBot Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant">
              <X className="h-5 w-5 text-slate-300" />
            </button>
          </div>
          <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
            {messages.map((message, index) => (
              <p key={index} className={`rounded-2xl p-3 text-sm leading-6 ${message.from === 'bot' ? 'bg-white/10' : 'bg-red-600/80'}`}>
                {message.text}
              </p>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => reply('magnitude')} className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold">Magnitude</button>
            <button onClick={() => reply('tsunami')} className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold">Tsunami</button>
            <button onClick={() => reply('safety')} className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold">Safety</button>
            <button onClick={() => go('nearby', 'Opening nearby earthquake awareness.')} className="rounded-full bg-cyan-500/20 px-3 py-2 text-xs font-bold">Nearby</button>
            <button onClick={() => go('alerts', 'Opening alert rules.')} className="rounded-full bg-red-500/30 px-3 py-2 text-xs font-bold">Alerts</button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((value) => !value)}
        className="group relative grid h-16 w-16 place-items-center rounded-3xl bg-slate-950 text-white shadow-2xl shadow-cyan-950/30"
        aria-label="Open GeoBot assistant"
      >
        <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 ring-4 ring-white" />
        {open ? <Send className="h-7 w-7 text-cyan-200" /> : <MessageCircle className="h-7 w-7 text-cyan-200 group-hover:animate-pulse" />}
      </button>
    </div>
  );
}
