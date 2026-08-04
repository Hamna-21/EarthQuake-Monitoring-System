import { Copy, RefreshCw, RotateCcw, Sparkles, Square, Trash2 } from 'lucide-react';
import AssistantAction from './AssistantAction';
import VoiceReplyToggle from './VoiceReplyToggle';

interface AssistantHeaderProps {
  voiceReply: boolean;
  hasAssistantMessage: boolean;
  hasMessages: boolean;
  hasLastUserMessage: boolean;
  isLoading: boolean;
  hasError: boolean;
  onToggleVoice: () => void;
  onNewChat: () => void;
  onCopy: () => void;
  onRegenerate: () => void;
  onClear: () => void;
  onStop: () => void;
}

export default function AssistantHeader(props: AssistantHeaderProps) {
  return (
    <header className="shrink-0 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-rose-500/10 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200"><Sparkles className="h-3 w-3" /> GeoPulse AI Assistant</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white">Seismic Guidance Assistant</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <VoiceReplyToggle enabled={props.voiceReply} onToggle={props.onToggleVoice} />
          <AssistantAction onClick={props.onNewChat} icon={<RotateCcw className="h-4 w-4" />} label="New Chat" />
          <AssistantAction onClick={props.onCopy} icon={<Copy className="h-4 w-4" />} label="Copy" disabled={!props.hasAssistantMessage} />
          <AssistantAction onClick={props.onRegenerate} icon={<RefreshCw className="h-4 w-4" />} label="Regenerate" disabled={!props.hasLastUserMessage || props.isLoading} />
          <AssistantAction onClick={props.onClear} icon={<Trash2 className="h-4 w-4" />} label="Clear Chat" disabled={!props.hasMessages && !props.hasError} />
          <AssistantAction onClick={props.onStop} icon={<Square className="h-4 w-4" />} label="Stop" disabled={!props.isLoading} danger />
        </div>
      </div>
    </header>
  );
}
