import { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ChatMessage } from '../../../../utils/chatApi';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

function MarkdownContent({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        h1: ({ children }) => (
          <h1 className="mt-3 mb-2 text-lg font-black tracking-tight text-cyan-300 first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-3 mb-1.5 text-base font-extrabold tracking-tight text-cyan-300 first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-2.5 mb-1 text-sm font-bold text-sky-300 first:mt-0">{children}</h3>
        ),
        p: ({ children }) => <p className="mb-2 leading-relaxed last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-bold text-fuchsia-300">{children}</strong>,
        em: ({ children }) => <em className="italic text-sky-200">{children}</em>,
        ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1 marker:text-cyan-400">{children}</ul>,
        ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1 marker:text-cyan-400 marker:font-bold">{children}</ol>,
        li: ({ children }) => <li className="pl-1">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="my-2 border-l-4 border-fuchsia-400/60 bg-fuchsia-500/5 py-1 pl-3 italic text-slate-300">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="my-3 border-white/10" />,
        a: ({ children, href }) => (
          <a href={href} target="_blank" rel="noreferrer" className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200">
            {children}
          </a>
        ),
        code: ({ children, className }) => {
          const isBlock = className?.includes('language-');
          if (isBlock) {
            return <code className="block whitespace-pre-wrap font-mono text-xs text-emerald-300">{children}</code>;
          }
          return (
            <code className="rounded bg-fuchsia-500/10 px-1.5 py-0.5 font-mono text-xs text-fuchsia-300">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="my-2 overflow-x-auto rounded-xl border border-emerald-400/20 bg-emerald-950/30 p-3">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="my-2 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full border-collapse text-left text-xs">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-cyan-500/10">{children}</thead>,
        th: ({ children }) => <th className="border-b border-white/10 px-3 py-2 font-bold text-cyan-300">{children}</th>,
        td: ({ children }) => <td className="border-b border-white/5 px-3 py-2 text-slate-200 align-top">{children}</td>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

export default function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/40 p-4 space-y-4 max-h-[500px]">
      {messages.map((m, idx) => (
        <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {m.role !== 'user' && (
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-md shadow-cyan-900/40">
              <Bot className="h-4 w-4 text-white" />
            </span>
          )}
          <div
            className={`max-w-[80%] rounded-2xl p-3.5 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white whitespace-pre-wrap'
                : 'border border-white/5 bg-white/[0.06] text-slate-100'
            }`}
          >
            {m.role === 'user' ? m.content : <MarkdownContent text={m.content} />}
          </div>
          {m.role === 'user' && (
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/10 text-white">
              <User className="h-4 w-4" />
            </span>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="flex gap-3 justify-start items-center">
          <span className="grid h-8 w-8 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-md shadow-cyan-900/40 animate-pulse">
            <Bot className="h-4 w-4 text-white" />
          </span>
          <div className="flex gap-1.5 rounded-2xl border border-white/5 bg-white/[0.06] px-4 py-3">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-2 w-2 rounded-full bg-fuchsia-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}