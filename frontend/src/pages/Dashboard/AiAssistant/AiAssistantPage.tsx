import { useMemo, useRef, useState } from 'react';
import { Bot, Copy, RefreshCw, RotateCcw, Sparkles, Square, Trash2 } from 'lucide-react';
import { DashboardProps } from '../../../components/dashboard/types';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import AssistantAction from './components/AssistantAction';
import { ChatMessage, streamChatResponse } from '../../../utils/chatApi';

type Props = DashboardProps & { userName: string | null; userEmail: string | null };

export default function AiAssistantPage({ earthquakes, selectedEvent, userName, userEmail }: Props) {
  const displayName = userName || userEmail?.split('@')[0] || 'there';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastUserMessage = [...messages].reverse().find((msg) => msg.role === 'user')?.content;
  const dashboardSummary = useMemo(() => ({
    visibleEvents: earthquakes.length,
    strongestMagnitude: earthquakes.reduce((max, event) => Math.max(max, event.magnitude), 0),
    selectedPlace: selectedEvent?.place ?? null,
    selectedMagnitude: selectedEvent?.magnitude ?? null,
  }), [earthquakes, selectedEvent]);
  const ask = (text: string, baseHistory = messages) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setError(null);
    const timeoutId = window.setTimeout(() => {
      setError('The assistant took too long to respond. Please try again.');
      controller.abort();
    }, 45000);

    const userMsg: ChatMessage = { role: 'user', content: trimmed, timestamp: Date.now() };
    const history = [...baseHistory, userMsg];
    setMessages([...history, { role: 'assistant', content: '', timestamp: Date.now() }]);
    setIsLoading(true);
    let answer = '';
    streamChatResponse(
      trimmed,
      history,
      { selectedEvent, currentView: 'ai_assistant', userName: displayName, dashboardSummary },
      (chunk) => {
        answer += chunk;
        setMessages((current) => current.map((msg, index) => index === current.length - 1 ? { ...msg, content: answer } : msg));
      },
      (err) => { setError(err); setMessages((current) => current.slice(0, -1)); setIsLoading(false); },
      () => {
        window.clearTimeout(timeoutId);
        if (!answer.trim() && !controller.signal.aborted) setError('The assistant did not return an answer. Please try again.');
        setMessages((current) => current.filter((msg) => msg.role !== 'assistant' || msg.content.trim()));
        setIsLoading(false);
        abortRef.current = null;
      },
      controller.signal
    );
  };
  const stop = () => abortRef.current?.abort();
  const clearChat = () => { stop(); setMessages([]); setError(null); setIsLoading(false); };
  const regenerate = () => {
    if (!lastUserMessage || isLoading) return;
    let base = [...messages];
    if (base.at(-1)?.role === 'assistant') base = base.slice(0, -1);
    if (base.at(-1)?.role === 'user') base = base.slice(0, -1);
    ask(lastUserMessage, base);
  };
  const copyLast = async () => {
    const lastAnswer = [...messages].reverse().find((msg) => msg.role === 'assistant' && msg.content.trim());
    if (lastAnswer) await navigator.clipboard?.writeText(lastAnswer.content);
  };

  return (
    <section className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-cyan-300/20 bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,0.20),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(244,63,94,0.18),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(2,6,23,0.84))] shadow-[0_28px_100px_rgba(0,0,0,0.36)] backdrop-blur-xl">
      <header className="shrink-0 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-rose-500/10 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 shadow-lg shadow-cyan-950/40">
              <Bot className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200"><Sparkles className="h-3 w-3" /> GeoPulse AI Assistant</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-white">Seismic Guidance Assistant</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <AssistantAction onClick={clearChat} icon={<RotateCcw className="h-4 w-4" />} label="New Chat" />
            <AssistantAction onClick={copyLast} icon={<Copy className="h-4 w-4" />} label="Copy" disabled={!messages.some((m) => m.role === 'assistant')} />
            <AssistantAction onClick={regenerate} icon={<RefreshCw className="h-4 w-4" />} label="Regenerate" disabled={!lastUserMessage || isLoading} />
            <AssistantAction onClick={clearChat} icon={<Trash2 className="h-4 w-4" />} label="Clear Chat" disabled={!messages.length && !error} />
            <AssistantAction onClick={stop} icon={<Square className="h-4 w-4" />} label="Stop" disabled={!isLoading} danger />
          </div>
        </div>
      </header>
      <ChatWindow messages={messages} isLoading={isLoading} userName={displayName} error={error} />
      <footer className="shrink-0 border-t border-white/10 bg-slate-950/40 p-4">
        <ChatInput onSend={ask} isLoading={isLoading} onStop={stop} />
      </footer>
    </section>
  );
}
