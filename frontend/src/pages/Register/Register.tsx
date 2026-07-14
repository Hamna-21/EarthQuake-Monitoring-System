import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout/AuthLayout';
import RegisterForm from '../../components/auth/RegisterForm/RegisterForm';
import RegisterSuccessOverlay from '../../components/auth/RegisterForm/RegisterSuccessOverlay';
import { useRegister } from '../../hooks/useRegister';

interface RegisterProps {
  onSuccess: (email: string, token: string, name?: string) => void;
  onNavigateToLogin: () => void;
  onBackToHome: () => void;
}

export default function Register({ onSuccess, onNavigateToLogin, onBackToHome }: RegisterProps) {
  const registerState = useRegister({ onSuccess });

  return (
    <AuthLayout onBackToHome={onBackToHome}>
      {registerState.registerSuccess && (
        <RegisterSuccessOverlay fullName={registerState.fullName} />
      )}

      <RegisterForm
        fullName={registerState.fullName}
        setFullName={registerState.setFullName}
        email={registerState.email}
        setEmail={registerState.setEmail}
        password={registerState.password}
        setPassword={registerState.setPassword}
        confirmPassword={registerState.confirmPassword}
        setConfirmPassword={registerState.setConfirmPassword}
        country={registerState.country}
        setCountry={registerState.setCountry}
        organization={registerState.organization}
        setOrganization={registerState.setOrganization}
        acceptTerms={registerState.acceptTerms}
        setAcceptTerms={registerState.setAcceptTerms}
        receiveAlerts={registerState.receiveAlerts}
        setReceiveAlerts={registerState.setReceiveAlerts}
        showPassword={registerState.showPassword}
        setShowPassword={registerState.setShowPassword}
        showConfirmPassword={registerState.showConfirmPassword}
        setShowConfirmPassword={registerState.setShowConfirmPassword}
        passwordStrength={registerState.passwordStrength}
        countries={registerState.countries}
        error={registerState.error}
        isLoading={registerState.isLoading}
        onSubmit={registerState.handleRegisterSubmit}
        onGoogleStart={() => {
          registerState.setError('');
          registerState.setIsLoading(true);
        }}
        onGoogleSuccess={() => {}}
        onGoogleFailure={(err) => {
          registerState.setError(err.message || 'Google Auth Initialization Error');
          registerState.setIsLoading(false);
        }}
        onNavigateToLogin={onNavigateToLogin}
      />
    </AuthLayout>
  );
}
