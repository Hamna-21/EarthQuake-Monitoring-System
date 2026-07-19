import { ArrowRight } from 'lucide-react';
import GoogleLoginButton from '../GoogleLogin/GoogleLoginButton';
import { AuthDivider, AuthError, AuthFooter, AuthLead } from '../shared/AuthFormChrome';
import RegisterAccountFields from './components/RegisterAccountFields';
import RegisterPasswordFields from './components/RegisterPasswordFields';
import RegisterPreferences from './components/RegisterPreferences';
import { RegisterFormProps } from './registerTypes';

export default function RegisterForm(props: RegisterFormProps) {
  return (
    <div>
      <AuthLead title="Create Account" text="Register for professional seismic alerts and dashboard access." />
      <AuthError error={props.error} />
      <form onSubmit={props.onSubmit} className="space-y-4">
        <RegisterAccountFields
          fullName={props.fullName}
          setFullName={props.setFullName}
          email={props.email}
          setEmail={props.setEmail}
          country={props.country}
          setCountry={props.setCountry}
          organization={props.organization}
          setOrganization={props.setOrganization}
          countries={props.countries}
          isLoading={props.isLoading}
        />
        <RegisterPasswordFields
          password={props.password}
          setPassword={props.setPassword}
          confirmPassword={props.confirmPassword}
          setConfirmPassword={props.setConfirmPassword}
          showPassword={props.showPassword}
          setShowPassword={props.setShowPassword}
          showConfirmPassword={props.showConfirmPassword}
          setShowConfirmPassword={props.setShowConfirmPassword}
          passwordStrength={props.passwordStrength}
          isLoading={props.isLoading}
        />
        <RegisterPreferences
          acceptTerms={props.acceptTerms}
          setAcceptTerms={props.setAcceptTerms}
          receiveAlerts={props.receiveAlerts}
          setReceiveAlerts={props.setReceiveAlerts}
        />
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 py-4 text-xs font-black uppercase tracking-[0.22em] text-white shadow-xl shadow-red-700/25 transition hover:-translate-y-0.5 disabled:opacity-50"
          disabled={props.isLoading}
        >
          {props.isLoading ? 'Authenticating...' : 'Establish Coordinates'}
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
        Already have GeoPulse keys?{' '}
        <button onClick={props.onNavigateToLogin} className="font-black text-cyan-200 hover:text-white">
          Verify active key
        </button>
      </AuthFooter>
    </div>
  );
}
