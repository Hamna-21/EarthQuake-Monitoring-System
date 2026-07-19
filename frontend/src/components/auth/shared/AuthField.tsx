import { LucideIcon } from 'lucide-react';

interface AuthFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  placeholder: string;
  type?: string;
  disabled?: boolean;
}

export default function AuthField({
  label,
  value,
  onChange,
  icon: Icon,
  placeholder,
  type = 'text',
  disabled = false,
}: AuthFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      <span className="relative block">
        <Icon className="absolute left-4 top-3.5 h-4 w-4 text-cyan-100/50" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-white/10 bg-black/25 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
          disabled={disabled}
        />
      </span>
    </label>
  );
}
