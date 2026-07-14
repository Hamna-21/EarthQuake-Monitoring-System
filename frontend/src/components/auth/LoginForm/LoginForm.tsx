import React from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import GoogleLoginButton from '../GoogleLogin/GoogleLoginButton';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (rem: boolean) => void;
  error: string;
  isLoading: boolean;
  onForgotPasswordClick: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleStart: () => void;
  onGoogleSuccess: (url: string) => void;
  onGoogleFailure: (err: any) => void;
  onNavigateToRegister: () => void;
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  error,
  isLoading,
  onForgotPasswordClick,
  onSubmit,
  onGoogleStart,
  onGoogleSuccess,
  onGoogleFailure,
  onNavigateToRegister,
}: LoginFormProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black uppercase tracking-wider text-white">
          Welcome back
        </h2>
        <p className="text-xs font-light text-red-100/60 mt-1 italic">
          Access the live GeoPulse early warning command room.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono uppercase tracking-wide">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Email Address */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-red-100/50 mb-2 font-mono">
            Security Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4.5 top-3.5 h-4 w-4 text-red-100/40" />
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@geopulse.com"
              className="w-full bg-black/40 border border-red-900/30 rounded-none py-3.5 pl-12 pr-4 text-sm font-light text-white placeholder-red-100/20 focus:outline-none focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.25)] transition-all duration-300"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] uppercase tracking-widest text-red-100/50 font-mono">
              Passphrase
            </label>
            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-[10px] uppercase tracking-wider text-red-400 hover:text-orange-400 font-mono transition-colors cursor-pointer"
            >
              Key Lost?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-4.5 top-3.5 h-4 w-4 text-red-100/40" />
            <input 
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-black/40 border border-red-900/30 rounded-none py-3.5 pl-12 pr-12 text-sm font-light text-white placeholder-red-100/20 focus:outline-none focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.25)] transition-all duration-300"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-red-100/40 hover:text-red-400 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Options (Remember me) */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs text-red-100/60 font-light cursor-pointer">
            <input 
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-red-500 h-4 w-4 bg-black/50 border border-red-900/30 rounded-none focus:ring-0"
            />
            <span>Authorize Session Persistence</span>
          </label>
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          className="w-full py-4.5 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white font-bold text-xs uppercase tracking-[0.25em] shadow-xl shadow-red-700/30 hover:scale-105 hover:shadow-red-500/55 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Authenticating...' : 'Access Dashboard'}
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* Social Login option */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-red-900/20 w-full" />
          <span className="absolute px-3 bg-[#170F0E] text-[10px] text-red-100/40 uppercase tracking-widest font-mono">
            OR
          </span>
        </div>

        {/* Google Sign In option */}
        <GoogleLoginButton 
          onStart={onGoogleStart}
          onSuccess={onGoogleSuccess}
          onFailure={onGoogleFailure}
        />
      </form>

      {/* Toggle view trigger */}
      <div className="mt-8 text-center text-xs text-red-100/50">
        <span>New to GeoPulse early detection? </span>
        <button
          onClick={onNavigateToRegister}
          className="font-bold text-red-400 hover:text-orange-400 hover:underline cursor-pointer transition-colors"
        >
          Create Secure Credentials
        </button>
      </div>
    </div>
  );
}
