import { useEffect, useMemo, useRef, useState } from 'react';
import { BotMessageSquare, History, Plus, Send, Sparkles, Square, Trash2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import type { Earthquake } from '@/types';
import { type ChatMessage, streamChatResponse } from '@/features/dashboard/prediction/services/chatService';
import { GeoBotChat, useGeoBotHistory } from '@/features/dashboard/components/useGeoBotHistory';

type Props = { earthquakes: Earthquake[]; selectedEvent: Earthquake | null; userName?: string | null; userEmail?: string | null };

/** Renders or coordinates geo bot card for this frontend module. */
export default function GeoBotCard({ earthquakes, selectedEvent, userName, userEmail }: Props) {
  const name = userName || userEmail?.split('@')[0] || 'there';
  const [open, setOpen] = useState(false); const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]); const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); const abortRef = useRef<AbortController | null>(null);
  const [showHistory, setShowHistory] = useState(false); const history = useGeoBotHistory(`geopulse_geobot_chats:${userEmail || userName || 'guest'}`);
  const summary = useMemo(() => ({ visibleEvents: earthquakes.length, strongestMagnitude: earthquakes.reduce((max, event) => Math.max(max, event.magnitude), 0), selectedPlace: selectedEvent?.place ?? null, selectedMagnitude: selectedEvent?.magnitude ?? null }), [earthquakes, selectedEvent]);
  useEffect(() => { history.save(messages); }, [messages]);
  const stop = () => { abortRef.current?.abort(); abortRef.current = null; setLoading(false); };
  const newChat = () => { stop(); history.startNew(); setMessages([]); setError(null); setShowHistory(false); };
  const openChat = (id: string) => { setMessages(history.select(id)); setError(null); setShowHistory(false); };
  const send = () => {
    const text = input.trim(); if (!text || loading) return;
    const controller = new AbortController(); abortRef.current = controller;
    const history: ChatMessage[] = [...messages, { role: 'user', content: text, timestamp: Date.now() }];
    setInput(''); setError(null); setLoading(true); setMessages([...history, { role: 'assistant', content: '', timestamp: Date.now() + 1 }]);
    let answer = '';
    streamChatResponse(text, history, { selectedEvent, currentView: 'overview', userName: name, dashboardSummary: summary }, (chunk) => {
      answer += chunk; setMessages((items) => items.map((item, index) => index === items.length - 1 ? { ...item, content: answer } : item));
    }, (message) => { setError(message); setMessages((items) => items.filter((item) => item.content.trim())); setLoading(false); abortRef.current = null; }, () => {
      setMessages((items) => items.filter((item) => item.role !== 'assistant' || item.content.trim())); setLoading(false); abortRef.current = null;
    }, controller.signal);
  };
  return <>{open && <section className="geobot-panel"><header className="geobot-header"><div className="geobot-header__identity"><BotIcon size="header" /><div><p className="text-sm font-black text-white">GeoBot</p><p className="text-xs font-semibold text-cyan-100/70">Earthquake information assistant</p></div></div><div className="geobot-header__actions"><TinyButton label="Previous chats" onClick={() => setShowHistory((value) => !value)}><History className="h-4 w-4" /></TinyButton><TinyButton label="New chat" onClick={newChat}><Plus className="h-4 w-4" /></TinyButton><TinyButton label="Close GeoBot" onClick={() => setOpen(false)}><X className="h-4 w-4" /></TinyButton></div></header><div className="geobot-messages">{showHistory ? <HistoryList chats={history.chats} onOpen={openChat} onDelete={history.remove} /> : <>{messages.length === 0 && <Welcome name={name} />}{messages.map((message, index) => <div key={`${message.timestamp}-${index}`} className={`geobot-message-row ${message.role === 'user' ? 'geobot-message-row--user' : 'geobot-message-row--assistant'}`}><div className={`geobot-message ${message.role === 'user' ? 'geobot-message--user' : 'geobot-message--assistant'}`}>{message.role === 'assistant' && message.content ? <AssistantMarkdown text={message.content} /> : message.content || (loading ? 'Thinking...' : '')}</div></div>)}{error && <p className="geobot-error">{error}</p>}</>}</div><div className="geobot-composer"><div className="geobot-composer__row"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); send(); } }} placeholder="Ask GeoBot..." className="geobot-composer__input" /><button type="button" onClick={loading ? stop : send} disabled={!loading && !input.trim()} aria-label={loading ? 'Stop GeoBot response' : 'Send message'} className="geobot-composer__send">{loading ? <Square className="h-4 w-4 fill-current" /> : <Send className="h-4 w-4" />}</button></div></div></section>}<button type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Minimize GeoBot' : 'Open GeoBot'} className="geobot-toggle">{open ? <span className="grid h-14 w-14 place-items-center rounded-full border border-cyan-100/30 bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 text-white shadow-[0_12px_35px_rgba(8,145,178,0.4)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:brightness-110"><X className="h-6 w-6" /></span> : <ToggleBotIcon />}</button></>;
}

/** Renders or coordinates toggle bot icon for this frontend module. */
function ToggleBotIcon() {
  return (
    <span className="relative grid h-14 w-14 place-items-center">
      <span className="geobot-pulse absolute inset-0 animate-ping rounded-full bg-cyan-400/25" />
      <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-cyan-400/40 via-blue-500/30 to-violet-600/40 blur-md" />
      <span className="relative grid h-14 w-14 place-items-center rounded-full border border-cyan-100/30 bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 text-white shadow-[0_12px_35px_rgba(8,145,178,0.45)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:brightness-110">
        <BotMessageSquare className="h-6 w-6" />
        <Sparkles className="geobot-sparkle absolute -right-1 -top-1 h-4 w-4 animate-pulse text-yellow-200" />
        <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400 shadow-[0_0_6px_#34d399]" />
      </span>
    </span>
  );
}

/** Renders or coordinates bot icon for this frontend module. */
function BotIcon({ size }: { size: 'header' | 'welcome' }) {
  const dims = size === 'header' ? { outer: 'h-9 w-9', ring: '-inset-0.5', icon: 'h-5 w-5', sparkle: 'h-3.5 w-3.5' } : { outer: 'h-14 w-14', ring: '-inset-1', icon: 'h-7 w-7', sparkle: 'h-4 w-4' };
  return (
    <span className={`relative grid ${dims.outer} place-items-center`}>
      <span className={`absolute ${dims.ring} rounded-2xl bg-gradient-to-br from-cyan-400/50 via-blue-500/30 to-violet-500/50 blur-sm`} />
      <span className={`relative grid ${dims.outer} place-items-center rounded-xl border border-cyan-200/25 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 shadow-lg shadow-cyan-950/40`}>
        <BotMessageSquare className={`${dims.icon} text-cyan-100`} />
        <Sparkles className={`geobot-sparkle absolute -right-1 -top-1 ${dims.sparkle} animate-pulse text-amber-200`} />
      </span>
    </span>
  );
}

/** Renders or coordinates welcome for this frontend module. */
function Welcome({ name }: { name: string }) {
  return <div className="flex h-full flex-col items-center justify-center text-center"><span className="mb-3"><BotIcon size="welcome" /></span><p className="text-sm font-black text-white">Hi {name}, I'm GeoBot</p><p className="mt-1 max-w-[240px] text-xs leading-5 text-slate-300">Ask me about earthquakes, nearby activity, magnitudes, aftershocks, or safety.</p></div>;
}

/** Renders or coordinates assistant markdown for this frontend module. */
function AssistantMarkdown({ text }: { text: string }) {
  return <div className="[&_.katex-display]:my-3 [&_.katex-display]:overflow-x-auto [&_.katex-display]:rounded-xl [&_.katex-display]:border [&_.katex-display]:border-cyan-300/15 [&_.katex-display]:bg-slate-950/60 [&_.katex-display]:px-3 [&_.katex-display]:py-2 [&_.katex-display]:text-center"><ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={{ h1: ({ children }) => <h3 className="mb-1.5 text-sm font-black text-cyan-200">{children}</h3>, h2: ({ children }) => <h3 className="mb-1.5 text-sm font-black text-cyan-200">{children}</h3>, p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>, ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1 marker:text-orange-300">{children}</ul>, ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1 marker:text-orange-300">{children}</ol>, strong: ({ children }) => <ValueMark>{children}</ValueMark> }}>{text}</ReactMarkdown></div>;
}

/** Renders or coordinates value mark for this frontend module. */
function ValueMark({ children }: { children: React.ReactNode }) {
  const value = String(children).trim();
  const tone = ({ Low: 'bg-emerald-400/15 text-emerald-100', Moderate: 'bg-amber-400/15 text-amber-100', Elevated: 'bg-orange-400/15 text-orange-100', High: 'bg-rose-400/15 text-rose-100', Safety: 'bg-cyan-400/15 text-cyan-100', Aftershock: 'bg-violet-400/15 text-violet-100' } as Record<string, string>)[value];
  return <strong className={tone ? `rounded-full px-1.5 py-0.5 text-xs font-black ${tone}` : 'font-black text-cyan-100'}>{children}</strong>;
}

/** Renders or coordinates tiny button for this frontend module. */
function TinyButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} aria-label={label} className="rounded-lg border border-transparent p-2 text-cyan-100/70 transition hover:border-cyan-200/20 hover:bg-cyan-400/10 hover:text-white">{children}</button>;
}

/** Renders or coordinates history list for this frontend module. */
function HistoryList({ chats, onOpen, onDelete }: { chats: GeoBotChat[]; onOpen: (id: string) => void; onDelete: (id: string) => void }) {
  return <div><p className="mb-2 text-xs font-black uppercase tracking-wider text-cyan-100/70">Previous chats</p>{chats.length ? <div className="space-y-2">{chats.map((chat) => <div key={chat.id} className="geobot-history-card"><button type="button" onClick={() => onOpen(chat.id)} className="min-w-0 flex-1 text-left hover:text-cyan-100"><p className="truncate text-sm font-black text-white">{chat.title}</p><p className="mt-1 text-[11px] font-semibold text-slate-400">{new Date(chat.updatedAt).toLocaleDateString()}</p></button><button type="button" onClick={() => onDelete(chat.id)} aria-label={`Delete ${chat.title}`} className="rounded-lg border border-transparent p-2 text-rose-200/70 transition hover:border-rose-300/20 hover:bg-rose-500/15 hover:text-rose-100"><Trash2 className="h-4 w-4" /></button></div>)}</div> : <p className="pt-8 text-center text-sm font-semibold text-slate-400">No saved chats yet.</p>}</div>;
}
/** Provides the dashboard card that opens the GeoBot assistant experience. */
