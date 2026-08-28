import { Home } from 'lucide-react';

/** Renders or coordinates auth back button for this frontend module. */
export default function AuthBackButton({ onBackToHome }: { onBackToHome: () => void }) {
  return (
    <button
      onClick={onBackToHome}
      aria-label="Back to home"
      title="Home"
      className="absolute left-6 top-6 z-50 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/10 text-cyan-100 backdrop-blur-xl transition hover:bg-white/15"
    >
      <Home className="h-5 w-5 text-cyan-200" />
    </button>
  );
}

/** Provides the shared back-navigation action for authentication screens. */
