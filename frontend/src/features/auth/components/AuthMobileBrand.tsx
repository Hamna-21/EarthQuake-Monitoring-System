import { Activity } from 'lucide-react';

/** Renders or coordinates auth mobile brand for this frontend module. */
export default function AuthMobileBrand() {
  return (
    <div className="auth-mobile-brand">
      <Activity className="mb-3 h-10 w-10 animate-pulse text-cyan-200" />
      <h1 className="auth-mobile-brand__title">
        Earthquake Monitoring System
      </h1>
      <p className="auth-mobile-brand__subtitle">
        Monitoring and safety information
      </p>
    </div>
  );
}
/** Displays the compact authentication branding on small screens. */
