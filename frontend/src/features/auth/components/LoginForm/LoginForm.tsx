import { FormEvent } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import GoogleLoginButton from '@/features/auth/components/GoogleLogin/GoogleLoginButton';
import AuthField from '@/features/auth/components/shared/AuthField';
import AuthPasswordField from '@/features/auth/components/shared/AuthPasswordField';
import { AuthDivider, AuthError, AuthFooter, AuthLead } from '@/features/auth/components/shared/AuthFormChrome';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  error: string;
  isLoading: boolean;
  onForgotPasswordClick: () => void;
  onSubmit: (e: FormEvent) => void;
  onGoogleStart: () => void;
  onGoogleSuccess: (url: string) => void;
  onGoogleFailure: (err: unknown) => void;
  onNavigateToRegister: () => void;
}

/** Presents controlled login fields and forwards submit/OAuth actions to the auth hook. */
export default function LoginForm(props: LoginFormProps) {
  return (
    <div>
      <AuthLead title="Welcome back" text="View earthquake activity and safety information." />
      <AuthError error={props.error} />
      <form onSubmit={props.onSubmit} className="space-y-5">
        <AuthField
          label="Email address"
          value={props.email}
          onChange={props.setEmail}
          icon={Mail}
          placeholder="name@example.com"
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
        <PrimaryButton
          type="submit"
          disabled={props.isLoading}
        >
          {props.isLoading ? 'Authenticating...' : 'Access Dashboard'}
          <ArrowRight className="h-4 w-4" />
        </PrimaryButton>
        <AuthDivider />
        <GoogleLoginButton
          onStart={props.onGoogleStart}
          onSuccess={props.onGoogleSuccess}
          onFailure={props.onGoogleFailure}
        />
      </form>
      <AuthFooter>
        New to Earthquake Monitoring System?{' '}
        <button onClick={props.onNavigateToRegister} className="font-black text-cyan-200 hover:text-white">
          Create secure credentials
        </button>
      </AuthFooter>
    </div>
  );
}

