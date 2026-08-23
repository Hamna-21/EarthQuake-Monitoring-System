import { ReactNode } from 'react';

/** Renders or coordinates auth error for this frontend module. */
export function AuthError({ error }: { error: string }) {
  if (!error) return null;
  return (
    <div className="mb-5 rounded-none border border-red-400/25 bg-red-500/10 p-3 text-xs font-semibold text-red-100">
      {error}
    </div>
  );
}

/** Renders or coordinates auth divider for this frontend module. */
export function AuthDivider() {
  return (
    <div className="relative my-6 flex items-center justify-center">
      <div className="w-full border-t border-white/10" />
      <span className="absolute bg-[#111827] px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
        OR
      </span>
    </div>
  );
}

/** Renders or coordinates auth lead for this frontend module. */
export function AuthLead({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-black uppercase tracking-[0.12em] text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

/** Renders or coordinates auth footer for this frontend module. */
export function AuthFooter({ children }: { children: ReactNode }) {
  return <div className="mt-8 text-center text-xs text-slate-400">{children}</div>;
}

/** Supplies common visual framing and status content for auth forms. */
