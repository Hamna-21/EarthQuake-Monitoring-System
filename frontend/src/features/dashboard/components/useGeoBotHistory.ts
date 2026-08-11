import { useEffect, useState } from 'react';
import type { ChatMessage } from '@/features/dashboard/prediction/services/chatService';

export type GeoBotChat = { id: string; title: string; messages: ChatMessage[]; updatedAt: number };

const readChats = (key: string): GeoBotChat[] => {
  try { return JSON.parse(localStorage.getItem(key) || '[]') as GeoBotChat[]; } catch { return []; }
};

export function useGeoBotHistory(key: string) {
  const [chats, setChats] = useState<GeoBotChat[]>(() => readChats(key));
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(chats)); } catch {} }, [chats, key]);
  useEffect(() => { setChats(readChats(key)); setActiveId(null); }, [key]);
  const save = (messages: ChatMessage[]) => {
    const clean = messages.filter((message) => message.content.trim());
    if (!clean.length) return;
    setChats((items) => {
      const id = activeId || `chat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const first = clean.find((message) => message.role === 'user')?.content || 'GeoBot conversation';
      const chat: GeoBotChat = { id, title: first.slice(0, 42), messages: clean, updatedAt: Date.now() };
      setActiveId(id);
      return [chat, ...items.filter((item) => item.id !== id)].slice(0, 12);
    });
  };
  const select = (id: string) => { const chat = chats.find((item) => item.id === id); setActiveId(chat?.id ?? null); return chat?.messages ?? []; };
  const remove = (id: string) => { setChats((items) => items.filter((item) => item.id !== id)); if (activeId === id) setActiveId(null); };
  return { chats, save, select, remove, startNew: () => setActiveId(null) };
}
