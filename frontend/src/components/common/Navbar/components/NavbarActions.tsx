import { ShieldAlert } from 'lucide-react';

interface NavbarActionsProps {
  userEmail?: string | null;
  onLogin: () => void;
  onRegister: () => void;
  onOpenWarningHub: () => void;
}

export default function NavbarActions({
  userEmail,
  onLogin,
  onRegister,
  onOpenWarningHub,
}: NavbarActionsProps) {
  return (
    <div className="flex items-center gap-3">
      {!userEmail && (
        <>
          <button onClick={onLogin} className="rounded-2xl border border-white/15 bg-white/8 px-4 py-2 font-bold text-white backdrop-blur-xl transition hover:bg-white/15">
            Login
          </button>
          <button onClick={onRegister} className="rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 font-bold text-white shadow-xl shadow-red-600/25 transition hover:-translate-y-0.5">
            Register
          </button>
        </>
      )}
      <button
        onClick={onOpenWarningHub}
        className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-red-600/25 transition hover:-translate-y-0.5"
      >
        <ShieldAlert className="h-4 w-4 group-hover:animate-pulse" />
        <span className="hidden sm:inline">Safety Hub</span>
        <span className="sm:hidden">Alerts</span>
      </button>
    </div>
  );
}
