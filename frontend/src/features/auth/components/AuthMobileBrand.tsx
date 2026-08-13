import { Activity } from 'lucide-react';

export default function AuthMobileBrand() {
  return (
    <div className="mb-10 mt-6 flex flex-col items-center text-center lg:hidden">
      <Activity className="mb-3 h-10 w-10 animate-pulse text-cyan-200" />
      <h1 className="max-w-[18rem] text-xl font-black uppercase leading-tight tracking-[0.12em] text-white sm:text-2xl">
        Earthquake Monitoring System
      </h1>
      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Monitoring and safety information
      </p>
    </div>
  );
}
