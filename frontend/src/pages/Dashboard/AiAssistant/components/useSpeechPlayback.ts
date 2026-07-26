import { useEffect, useState } from 'react';

const stripMarkdown = (text: string) => text.replace(/[`*_>#-]/g, ' ').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/\s+/g, ' ').trim();

export function useSpeechPlayback() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  const stop = () => {
    window.speechSynthesis?.cancel();
    setActiveKey(null);
    setPaused(false);
  };

  const speak = (key: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    stop();
    const utterance = new SpeechSynthesisUtterance(stripMarkdown(text));
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    utterance.onend = () => { setActiveKey(null); setPaused(false); };
    utterance.onerror = () => { setActiveKey(null); setPaused(false); };
    setActiveKey(key);
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    window.speechSynthesis?.pause();
    setPaused(true);
  };

  const resume = () => {
    window.speechSynthesis?.resume();
    setPaused(false);
  };

  useEffect(() => stop, []);
  return { activeKey, paused, speak, pause, resume, stop };
}
