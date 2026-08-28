import { ShieldAlert } from 'lucide-react';

interface NavbarActionsProps {
  userEmail?: string | null;
  onLogin: () => void;
  onRegister: () => void;
  onOpenWarningHub: () => void;
}

/** Renders or coordinates navbar actions for this frontend module. */
export default function NavbarActions({
  userEmail,
  onLogin,
  onRegister,
  onOpenWarningHub,
}: NavbarActionsProps) {
  return (
    <div className="landing-navbar__actions">
      {!userEmail && (
        <>
          <button onClick={onLogin} className="landing-navbar__action landing-navbar__action--muted">
            Login
          </button>
          <button onClick={onRegister} className="landing-navbar__action landing-navbar__action--primary">
            Register
          </button>
        </>
      )}
      <button
        onClick={onOpenWarningHub}
        className="landing-navbar__action landing-navbar__action--primary landing-navbar__safety"
      >
        <ShieldAlert />
        <span className="hidden sm:inline">Safety Hub</span>
        <span className="sm:hidden">Alerts</span>
      </button>
    </div>
  );
}

/** Renders authentication and utility actions shown in the shared navbar. */
