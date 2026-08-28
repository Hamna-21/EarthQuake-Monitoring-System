import { Activity } from 'lucide-react';

/** Renders or coordinates navbar logo for this frontend module. */
export default function NavbarLogo({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="landing-navbar__logo"
      aria-label="Go to Earthquake Monitoring System home"
    >
      <Activity />
      <span>
        Earthquake Monitoring System
      </span>
    </button>
  );
}
/** Displays the compact Earthquake Monitoring System brand mark. */
