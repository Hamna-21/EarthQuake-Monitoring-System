import { useState } from 'react';
import { Bot, MessageCircle, Sparkles, X } from 'lucide-react';
import { DashboardPage } from './types';
import { ChatMessage, streamChatResponse } from '../../utils/chatApi';
import ChatWindow from '../../pages/Dashboard/AiAssistant/components/ChatWindow';
import ChatInput from '../../pages/Dashboard/AiAssistant/components/ChatInput';

export default function GeoAssistant({ openPage }: { openPage: (page: DashboardPage) => void }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! Ask me quick seismic questions.", timestamp: Date.now() },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (text: string) => {
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: Date.now() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setIsLoading(true);

    let content = '';
    setMessages((prev) => [...prev, { role: 'assistant', content: '', timestamp: Date.now() }]);

    streamChatResponse(
      text,
      updated,
      { currentView: 'floating_widget' },
      (chunk) => {
        content += chunk;
        setMessages((prev) => {
          const list = [...prev];
          if (list.length > 0) {
            list[list.length - 1] = { role: 'assistant', content, timestamp: Date.now() };
          }
          return list;
        });
      },
      (err) => {
        setIsLoading(false);
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: `Error: ${err}`, timestamp: Date.now() },
        ]);
      },
      () => setIsLoading(false)
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl flex flex-col h-[400px]">
          <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-violet-600/20 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500">
                <Bot className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="text-sm font-black text-white">GeoBot Quick Chat</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 overflow-hidden p-2 flex flex-col">
            <ChatWindow messages={messages} isLoading={isLoading} />
          </div>
          <div className="p-3 border-t border-white/10">
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)} className="group relative grid h-12 w-12 place-items-center rounded-full text-white shadow-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500">
        <MessageCircle className="h-5 w-5 text-white" />
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
            <Sparkles className="h-2 w-2 text-white" />
          </span>
        )}
      </button>
    </div>
  );
}
