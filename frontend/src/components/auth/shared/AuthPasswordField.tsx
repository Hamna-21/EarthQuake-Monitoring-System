import { Eye, EyeOff, Lock } from 'lucide-react';

interface AuthPasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  disabled?: boolean;
  action?: React.ReactNode;
}

export default function AuthPasswordField(props: AuthPasswordFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {props.label}
        </span>
        {props.action}
      </span>
      <span className="relative block">
        <Lock className="absolute left-4 top-3.5 h-4 w-4 text-cyan-100/50" />
        <input
          type={props.show ? 'text' : 'password'}
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
          placeholder="••••••••••••"
          className="w-full rounded-2xl border border-white/10 bg-black/25 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
          disabled={props.disabled}
        />
        <button
          type="button"
          onClick={() => props.setShow(!props.show)}
          className="absolute right-4 top-3.5 text-slate-400 transition hover:text-cyan-100"
          aria-label={props.show ? 'Hide password' : 'Show password'}
        >
          {props.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </span>
    </label>
  );
}
