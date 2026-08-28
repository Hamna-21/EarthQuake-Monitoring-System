import { LucideIcon } from 'lucide-react';

interface AuthFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  placeholder: string;
  type?: string;
  disabled?: boolean;
  labelClassName?: string;
}

/** Renders or coordinates auth field for this frontend module. */
export default function AuthField({
  label,
  value,
  onChange,
  icon: Icon,
  placeholder,
  type = 'text',
  disabled = false,
  labelClassName = '',
}: AuthFieldProps) {
  return (
    <label className="auth-field">
      <span className={`auth-field__label ${labelClassName}`}>
        {label}
      </span>
      <span className="auth-field__control">
        <Icon className="auth-field__icon" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="auth-field__input"
          disabled={disabled}
        />
      </span>
    </label>
  );
}

/** Provides the shared labeled input control used by authentication forms. */
