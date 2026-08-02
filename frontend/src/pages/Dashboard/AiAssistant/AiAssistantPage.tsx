import { useMemo, useRef, useState } from 'react';
import { DashboardProps } from '../../../components/dashboard/types';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import AssistantHeader from './components/AssistantHeader';
import { ChatMessage, streamChatResponse } from '../../../utils/chatApi';

type Props = DashboardProps & { userName: string | null; userEmail: string | null };

export default function AiAssistantPage({ earthquakes, selectedEvent, userName, userEmail }: Props) {
  const displayName = userName || userEmail?.split('@')[0] || 'there';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceReply, setVoiceReply] = useState(false);
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
      <AssistantHeader
        voiceReply={voiceReply}
        hasAssistantMessage={messages.some((m) => m.role === 'assistant')} hasMessages={Boolean(messages.length)} hasLastUserMessage={Boolean(lastUserMessage)}
        isLoading={isLoading}
        hasError={Boolean(error)}
        onToggleVoice={() => setVoiceReply((value) => !value)}
        onNewChat={clearChat}
        onCopy={copyLast}
        onRegenerate={regenerate}
        onClear={clearChat}
        onStop={stop}
      />
      <ChatWindow messages={messages} isLoading={isLoading} userName={displayName} error={error} voiceReplyEnabled={voiceReply} />
      <footer className="shrink-0 border-t border-white/10 bg-slate-950/40 p-4">
        <ChatInput onSend={ask} isLoading={isLoading} onStop={stop} />
      </footer>
    </section>
  );
}
