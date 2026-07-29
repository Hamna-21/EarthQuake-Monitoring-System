import { useEffect, useRef } from 'react';
import { AlertCircle, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ChatMessage } from '../../../../utils/chatApi';
import ResponseSpeechControls from './ResponseSpeechControls';
import { useSpeechPlayback } from './useSpeechPlayback';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  userName: string;
  error: string | null;
  voiceReplyEnabled: boolean;
}

function MarkdownContent({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        h1: ({ children }) => <h1 className="mb-2 text-lg font-black text-cyan-200">{children}</h1>,
        h2: ({ children }) => <h2 className="mb-1.5 mt-3 text-base font-extrabold text-cyan-200">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-1 mt-2.5 text-sm font-bold text-sky-200">{children}</h3>,
        p: ({ children }) => <p className="mb-2 leading-relaxed last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
        ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1 marker:text-cyan-300">{children}</ul>,
        ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1 marker:text-cyan-300">{children}</ol>,
        li: ({ children }) => <li className="pl-1">{children}</li>,
        code: ({ children }) => <code className="rounded bg-cyan-500/10 px-1.5 py-0.5 font-serif text-xs text-cyan-100">{children}</code>,
        pre: ({ children }) => <pre className="my-2 overflow-x-auto rounded-2xl border border-white/10 bg-black/25 p-3">{children}</pre>,
        table: ({ children }) => <div className="my-2 overflow-x-auto rounded-2xl border border-white/10"><table className="w-full border-collapse text-left text-xs">{children}</table></div>,
        th: ({ children }) => <th className="border-b border-white/10 px-3 py-2 font-bold text-cyan-200">{children}</th>,
        td: ({ children }) => <td className="border-b border-white/5 px-3 py-2 text-slate-200 align-top">{children}</td>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

export default function ChatWindow({ messages, isLoading, userName, error, voiceReplyEnabled }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const speech = useSpeechPlayback();
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading, error]);
  useEffect(() => {
    const last = messages.at(-1);
    if (voiceReplyEnabled && !isLoading && last?.role === 'assistant' && last.content.trim()) {
      speech.speak(`${last.timestamp}`, last.content);
    }
  }, [voiceReplyEnabled, isLoading, messages]);

  if (!messages.length && !isLoading && !error) {
    return (
      <main className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-8">
        <div className="max-w-3xl rounded-2xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur-xl">
          <h2 className="bg-gradient-to-r from-cyan-200 via-white to-rose-200 bg-clip-text text-5xl font-black tracking-tight text-transparent">Hi, {userName}</h2>
          <p className="mt-5 text-lg leading-8 text-slate-200">
            I can help with earthquake safety, seismic terms, live dashboard data, nearby risk, historical events, alerts, and GeoPulse navigation.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-0 flex-1 overflow-y-auto p-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
        {messages.map((m, idx) => (
          <div key={`${m.timestamp}-${idx}`} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role !== 'user' && <Avatar icon={<Bot className="h-4 w-4 text-white" />} />}
            <div className={`max-w-[88%] rounded-2xl p-5 text-[15px] leading-7 shadow-lg ${m.role === 'user' ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 text-white whitespace-pre-wrap' : 'border border-cyan-300/15 bg-white/[0.08] text-slate-100'}`}>
              {m.role === 'user' ? m.content : m.content ? <MarkdownContent text={m.content} /> : <Typing />}
              {m.role === 'assistant' && m.content.trim() && (
                <ResponseSpeechControls active={speech.activeKey === `${m.timestamp}`} paused={speech.paused} onSpeak={() => speech.speak(`${m.timestamp}`, m.content)} onPause={speech.pause} onResume={speech.resume} onStop={speech.stop} />
              )}
            </div>
            {m.role === 'user' && <Avatar icon={<User className="h-4 w-4 text-white" />} muted />}
          </div>
        ))}
        {error && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 p-4 text-sm font-semibold text-red-100">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </main>
  );
}

function Avatar({ icon, muted }: { icon: React.ReactNode; muted?: boolean }) {
  return <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-2xl ${muted ? 'border border-white/10 bg-white/10' : 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-md shadow-cyan-900/40'}`}>{icon}</span>;
}

function Typing() {
  return <span className="inline-flex gap-1.5"><span className="h-2 w-2 animate-bounce rounded-full bg-cyan-300" /><span className="h-2 w-2 animate-bounce rounded-full bg-sky-300 [animation-delay:150ms]" /><span className="h-2 w-2 animate-bounce rounded-full bg-violet-300 [animation-delay:300ms]" /></span>;
}
