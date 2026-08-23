import type { ButtonHTMLAttributes } from 'react';

/** Renders or coordinates primary button for this frontend module. */
export default function PrimaryButton({ className = '', type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={`flex w-full items-center justify-center gap-2 rounded-none bg-gradient-to-r from-red-600 to-orange-500 py-4 text-xs font-black uppercase tracking-[0.22em] text-white shadow-xl shadow-red-700/25 transition hover:-translate-y-0.5 disabled:opacity-50 ${className}`} {...props} />;
}
/** Provides the primary action button used across the application. */
