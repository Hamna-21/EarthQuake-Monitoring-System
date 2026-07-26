import React, { useState } from 'react';
import { Send, Square } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, onStop, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
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
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <textarea
        value={input}
        rows={1}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Ask about earthquake risk, safety steps, seismic data, or GeoPulse tools..."
        disabled={isLoading}
        className="max-h-36 min-h-12 flex-1 resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
      />
      {isLoading ? (
        <button type="button" onClick={onStop} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-red-600 px-5 text-sm font-black text-white shadow-lg shadow-red-900/30 transition hover:bg-red-700">
          <Square className="h-4 w-4" /> Stop
        </button>
      ) : (
        <button type="submit" disabled={!input.trim()} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 text-sm font-black text-white shadow-lg shadow-cyan-900/30 transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-40">
          <Send className="h-4 w-4" /> Send
        </button>
      )}
    </form>
  );
}
