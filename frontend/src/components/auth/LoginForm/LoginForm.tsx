import { FormEvent } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import GoogleLoginButton from '../GoogleLogin/GoogleLoginButton';
import AuthField from '../shared/AuthField';
import AuthPasswordField from '../shared/AuthPasswordField';
import { AuthDivider, AuthError, AuthFooter, AuthLead } from '../shared/AuthFormChrome';

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
  onSubmit: (e: FormEvent) => void;
  onGoogleStart: () => void;
  onGoogleSuccess: (url: string) => void;
  onGoogleFailure: (err: any) => void;
  onNavigateToRegister: () => void;
}

export default function LoginForm(props: LoginFormProps) {
  return (
    <div>
      <AuthLead title="Welcome back" text="Access the GeoPulse seismic command room." />
      <AuthError error={props.error} />
      <form onSubmit={props.onSubmit} className="space-y-5">
        <AuthField
          label="Security Email"
          value={props.email}
          onChange={props.setEmail}
          icon={Mail}
          placeholder="admin@geopulse.com"
          type="email"
          disabled={props.isLoading}
        />
        <AuthPasswordField
          label="Passphrase"
          value={props.password}
          onChange={props.setPassword}
          show={props.showPassword}
          setShow={props.setShowPassword}
          disabled={props.isLoading}
          action={
            <button
              type="button"
              onClick={props.onForgotPasswordClick}
              className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200 hover:text-white"
            >
              Key Lost?
            </button>
          }
        />
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <input
            type="checkbox"
            checked={props.rememberMe}
            onChange={(event) => props.setRememberMe(event.target.checked)}
            className="h-4 w-4 accent-cyan-400"
          />
          Keep this secure session active
        </label>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 py-4 text-xs font-black uppercase tracking-[0.22em] text-white shadow-xl shadow-red-700/25 transition hover:-translate-y-0.5 disabled:opacity-50"
          disabled={props.isLoading}
        >
          {props.isLoading ? 'Authenticating...' : 'Access Dashboard'}
          <ArrowRight className="h-4 w-4" />
        </button>
        <AuthDivider />
        <GoogleLoginButton
          onStart={props.onGoogleStart}
          onSuccess={props.onGoogleSuccess}
          onFailure={props.onGoogleFailure}
        />
      </form>
      <AuthFooter>
        New to GeoPulse?{' '}
        <button onClick={props.onNavigateToRegister} className="font-black text-cyan-200 hover:text-white">
          Create secure credentials
        </button>
      </AuthFooter>
    </div>
  );
}
