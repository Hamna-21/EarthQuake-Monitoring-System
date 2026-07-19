import { Activity } from 'lucide-react';
import AuthStats from './AuthStats';

export default function AuthVisualPanel() {
  return (
    <aside className="relative z-10 hidden w-1/2 flex-col justify-between border-r border-white/10 bg-white/[0.04] p-14 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3">
        <Activity className="h-9 w-9 animate-pulse text-cyan-200" />
        <div>
          <p className="text-2xl font-black uppercase tracking-[0.24em] text-white">GeoPulse</p>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Enterprise Access node
          </p>
        </div>
      </div>

      <div className="relative mx-auto grid h-[420px] w-[420px] place-items-center">
  {/* ambient glow — matches orbit 2's size */}
  <div className="absolute h-[340px] w-[340px] rounded-full border border-cyan-300/10 bg-cyan-300/[0.03] blur-sm" />

  {/* orbit 1 — cyan satellite */}
  <div className="orbit-ring absolute z-20 h-[320px] w-[320px] rounded-full border border-cyan-300/10">
    <span className="satellite absolute h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_3px_1px_rgba(34,211,238,0.4)]" />
  </div>

  {/* orbit 2 — red satellite */}
  <div className="orbit-ring orbit-ring-reverse absolute z-20 h-[340px] w-[340px] rounded-full border border-red-400/10">
    <span className="satellite absolute h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_2px_1px_rgba(248,113,113,0.4)]" />
  </div>

  {/* the earth itself */}
  <div className="earth-sphere relative z-10 h-72 w-72 overflow-hidden rounded-full shadow-[0_0_60px_rgba(14,165,233,0.35)]">
    <div className="earth-texture absolute inset-0" />
    <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_30%,rgba(255,255,255,0.35),transparent_45%),radial-gradient(circle_at_70%_75%,rgba(0,0,0,0.55),transparent_60%)]" />
    <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-cyan-200/20" />
  </div>
</div>

      <AuthStats />

      <style>{`
        .earth-texture {
         background-image: url('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
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