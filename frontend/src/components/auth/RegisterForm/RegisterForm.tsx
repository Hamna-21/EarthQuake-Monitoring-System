import React from 'react';
import { Mail, Lock, Eye, EyeOff, User, Globe, Building2, ArrowRight } from 'lucide-react';
import GoogleLoginButton from '../GoogleLogin/GoogleLoginButton';

interface PasswordStrength {
  score: number;
  text: string;
  color: string;
}

interface RegisterFormProps {
  fullName: string;
  setFullName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (pass: string) => void;
  confirmPassword: string;
  setConfirmPassword: (pass: string) => void;
  country: string;
  setCountry: (country: string) => void;
  organization: string;
  setOrganization: (org: string) => void;
  acceptTerms: boolean;
  setAcceptTerms: (val: boolean) => void;
  receiveAlerts: boolean;
  setReceiveAlerts: (val: boolean) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  passwordStrength: PasswordStrength;
  countries: string[];
  error: string;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleStart: () => void;
  onGoogleSuccess: (url: string) => void;
  onGoogleFailure: (err: any) => void;
  onNavigateToLogin: () => void;
}

export default function RegisterForm({
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  country,
  setCountry,
  organization,
  setOrganization,
  acceptTerms,
  setAcceptTerms,
  receiveAlerts,
  setReceiveAlerts,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordStrength,
  countries,
  error,
  isLoading,
  onSubmit,
  onGoogleStart,
  onGoogleSuccess,
  onGoogleFailure,
  onNavigateToLogin,
}: RegisterFormProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black uppercase tracking-wider text-white">
          Create Account
        </h2>
        <p className="text-xs font-light text-red-100/60 mt-1 italic">
          Register coordinates to access professional seismic alerts.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono uppercase tracking-wide animate-fade-in">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-red-100/50 mb-1.5 font-mono">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4.5 top-3 h-4 w-4 text-red-100/40" />
            <input 
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alexander Mercer"
              className="w-full bg-black/40 border border-red-900/30 rounded-none py-3 pl-12 pr-4 text-sm font-light text-white placeholder-red-100/20 focus:outline-none focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.25)] transition-all duration-300"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-red-100/50 mb-1.5 font-mono">
            Security Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4.5 top-3 h-4 w-4 text-red-100/40" />
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@geopulse.com"
              className="w-full bg-black/40 border border-red-900/30 rounded-none py-3 pl-12 pr-4 text-sm font-light text-white placeholder-red-100/20 focus:outline-none focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.25)] transition-all duration-300"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Grid (Fields side by side on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-red-100/50 mb-1.5 font-mono">
              Passphrase
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3 h-4 w-4 text-red-100/40" />
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-red-900/30 rounded-none py-3 pl-11 pr-11 text-sm font-light text-white placeholder-red-100/20 focus:outline-none focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.25)] transition-all duration-300"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-red-100/40 hover:text-red-400 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-red-100/50 mb-1.5 font-mono">
              Confirm Passphrase
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3 h-4 w-4 text-red-100/40" />
              <input 
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-red-900/30 rounded-none py-3 pl-11 pr-11 text-sm font-light text-white placeholder-red-100/20 focus:outline-none focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.25)] transition-all duration-300"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3 text-red-100/40 hover:text-red-400 transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Password strength indicator bar */}
        {password && (
          <div className="space-y-1 pt-1">
            <div className="flex justify-between items-center text-[9px] font-mono uppercase text-red-100/40">
              <span>Passphrase Integrity</span>
              <span className="font-bold text-white">{passwordStrength.text}</span>
            </div>
            <div className="h-1.5 w-full bg-black/40 border border-red-900/25 relative">
              <div 
                className={`h-full ${passwordStrength.color} transition-all duration-500`}
                style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Country Selector & Organization (Horizontal layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-red-100/50 mb-1.5 font-mono">
              Monitor Region
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-3 h-4 w-4 text-red-100/40" />
              <select 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-black/45 border border-red-900/30 rounded-none py-3 pl-11 pr-4 text-sm font-light text-white focus:outline-none focus:border-red-500 transition-all appearance-none cursor-pointer"
                disabled={isLoading}
              >
                {countries.map((c) => (
                  <option key={c} value={c} className="bg-[#120B0A] text-white py-2">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-red-100/50 mb-1.5 font-mono">
              Affiliated Agency
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-3 h-4 w-4 text-red-100/40" />
              <input 
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="USGS / Research Org"
                className="w-full bg-black/40 border border-red-900/30 rounded-none py-3 pl-11 pr-4 text-sm font-light text-white placeholder-red-100/20 focus:outline-none focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.25)] transition-all duration-300"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Agreement Terms checkboxes */}
        <div className="space-y-2 pt-2">
          <label className="flex items-start gap-3 text-xs text-red-100/60 font-light cursor-pointer">
            <input 
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="accent-red-500 mt-0.5 h-4 w-4 bg-black/50 border border-red-900/30 rounded-none focus:ring-0"
            />
            <span>Authorize early warning telemetry alerts and data coordination standards</span>
          </label>

          <label className="flex items-start gap-3 text-xs text-red-100/60 font-light cursor-pointer">
            <input 
              type="checkbox"
              checked={receiveAlerts}
              onChange={(e) => setReceiveAlerts(e.target.checked)}
              className="accent-red-500 mt-0.5 h-4 w-4 bg-black/50 border border-red-900/30 rounded-none focus:ring-0"
            />
            <span>Receive urgent Richter Level 5+ trigger mailings</span>
          </label>
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white font-bold text-xs uppercase tracking-[0.25em] shadow-xl shadow-red-700/30 hover:scale-105 hover:shadow-red-500/55 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Authenticating...' : 'Establish Coordinates'}
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* Social Divider */}
        <div className="relative my-5 flex items-center justify-center">
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
      <div className="mt-6 text-center text-xs text-red-100/50">
        <span>Already have GeoPulse keys? </span>
        <button
          onClick={onNavigateToLogin}
          className="font-bold text-red-400 hover:text-orange-400 hover:underline cursor-pointer transition-colors"
        >
          Verify Active Key
        </button>
      </div>
    </div>
  );
}
