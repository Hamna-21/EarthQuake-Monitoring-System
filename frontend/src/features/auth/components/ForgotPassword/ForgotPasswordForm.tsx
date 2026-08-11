import React from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

interface ForgotPasswordFormProps {
  resetEmail: string;
  setResetEmail: (email: string) => void;
  resetSuccess: boolean;
  error: string;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBackToLogin: () => void;
}

export default function ForgotPasswordForm({
  resetEmail,
  setResetEmail,
  resetSuccess,
  error,
  isLoading,
  onSubmit,
  onBackToLogin,
}: ForgotPasswordFormProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black uppercase tracking-wider text-white">
          Reset Telemetry Keys
        </h2>
        <p className="text-xs font-light text-red-100/60 mt-1 italic">
          Enter your verified coordinate email to fetch a decryption trigger.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono uppercase tracking-wide">
          ⚠️ {error}
        </div>
      )}

      {resetSuccess ? (
        <div className="p-5 border border-emerald-900/30 bg-emerald-950/10 text-emerald-300 text-xs font-light leading-relaxed mb-6">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 mb-2" />
          We have sent decryption instructions to <span className="font-semibold">{resetEmail}</span>. Please verify your inbox sequence.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-red-100/50 mb-2 font-mono">
              Email Coordinates
            </label>
            <div className="relative">
              <Mail className="absolute left-4.5 top-3.5 h-4 w-4 text-red-100/40" />
              <input 
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="example@geopulse.com"
                className="w-full bg-black/40 border border-red-900/30 rounded-none py-3 pl-12 pr-4 text-sm font-light text-white placeholder-red-100/20 focus:outline-none focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.25)] transition-all duration-300"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-xs uppercase tracking-[0.25em] shadow-xl shadow-red-700/30 hover:scale-105 hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Triggering Transmission...' : 'Transmit Reset Code'}
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full text-center text-xs text-red-100/40 hover:text-red-400 font-mono uppercase tracking-wider transition-colors mt-2 cursor-pointer"
          >
            Back to Core Login
          </button>
        </form>
      )}
    </div>
  );
}
