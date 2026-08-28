import { Activity } from 'lucide-react';
import AuthStats from '@/features/auth/components/AuthStats';
import earthTexture from '@/assets/images/earth/earth-day.jpg';

/** Renders or coordinates auth visual panel for this frontend module. */
export default function AuthVisualPanel() {
  return (
    <aside className="auth-visual">
      <div className="auth-visual__brand">
        <Activity className="h-8 w-8 animate-pulse text-cyan-200" />
        <div>
          <p className="auth-visual__brand-title">Earthquake Monitoring System</p>
        </div>
      </div>

      <div className="auth-visual__earth">
  {/* ambient glow — matches orbit 2's size */}
  <div className="auth-visual__ambient-orbit" />

  {/* orbit 1 — cyan satellite */}
  <div className="auth-orbit auth-orbit--cyan">
    <span className="auth-satellite h-2 w-2 bg-cyan-300 shadow-[0_0_3px_1px_rgba(34,211,238,0.4)]" />
  </div>

  {/* orbit 2 — red satellite */}
  <div className="auth-orbit auth-orbit--red">
    <span className="auth-satellite h-1.5 w-1.5 bg-red-400 shadow-[0_0_2px_1px_rgba(248,113,113,0.4)]" />
  </div>

  {/* the earth itself */}
  <div className="auth-earth">
    <div className="earth-texture absolute inset-0" />
    <div className="auth-earth__overlay" />
    <div className="auth-earth__ring" />
  </div>
</div>

      <AuthStats />

      <style>{`
        .earth-texture {
          background-image: url('${earthTexture}');
          background-size: 200% 100%;
          background-repeat: repeat-x;
          animation: earthRotate 18s linear infinite;
        }
        @keyframes earthRotate {
          from { background-position: 0% 0%; }
          to { background-position: 200% 0%; }
        }
        .orbit-ring {
          animation: orbitSpin 10s linear infinite;
        }
        .orbit-ring-reverse {
          animation-name: orbitSpinReverse;
          animation-duration: 16s;
        }
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbitSpinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .satellite {
          top: 50%;
          left: 100%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </aside>
  );
}
