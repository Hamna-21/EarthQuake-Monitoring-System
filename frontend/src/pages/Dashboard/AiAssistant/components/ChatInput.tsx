import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { ds } from '../../../../components/dashboard/designSystem';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about earthquakes, safety guides, seismology..."
        disabled={isLoading}
        className={`${ds.input} flex-1`}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className={`${ds.buttonPrimary} flex items-center justify-center gap-2 px-5 py-3 disabled:opacity-50 disabled:pointer-events-none`}
      >
        <Send className="h-4 w-4" />
        <span>Send</span>
      </button>
    </form>
  );
}
