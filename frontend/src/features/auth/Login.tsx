import React from 'react';
import AuthLayout from '@/layouts/AuthLayout';
import LoginForm from '@/features/auth/components/LoginForm/LoginForm';
import ForgotPasswordForm from '@/features/auth/components/ForgotPassword/ForgotPasswordForm';
import LoginSuccessOverlay from '@/features/auth/components/LoginForm/LoginSuccessOverlay';
import { useLogin } from '@/features/auth/hooks/useLogin';

interface LoginProps {
  onSuccess: (email: string, token: string, name?: string) => void;
  onNavigateToRegister: () => void;
  onBackToHome: () => void;
}

/**
 * Coordinates the login form, password-reset view, Google OAuth messages, and success transition.
 */
export default function Login({ onSuccess, onNavigateToRegister, onBackToHome }: LoginProps) {
  const loginState = useLogin({ onSuccess });

  return (
    <AuthLayout onBackToHome={onBackToHome}>
      {loginState.loginSuccess && <LoginSuccessOverlay />}

      {loginState.forgotPasswordStep ? (
        <ForgotPasswordForm
          resetEmail={loginState.resetEmail}
          setResetEmail={loginState.setResetEmail}
          resetSuccess={loginState.resetSuccess}
          error={loginState.error}
          isLoading={loginState.isLoading}
          onSubmit={loginState.handleForgotPasswordSubmit}
          onBackToLogin={() => {
            loginState.setForgotPasswordStep(false);
            loginState.setError('');
          }}
        />
      ) : (
        <LoginForm
          email={loginState.email}
          setEmail={loginState.setEmail}
          password={loginState.password}
          setPassword={loginState.setPassword}
          showPassword={loginState.showPassword}
          setShowPassword={loginState.setShowPassword}
          error={loginState.error}
          isLoading={loginState.isLoading}
          onForgotPasswordClick={() => loginState.setForgotPasswordStep(true)}
          onSubmit={loginState.handleLoginSubmit}
          onGoogleStart={() => {
            loginState.setError('');
            loginState.setIsLoading(true);
          }}
          onGoogleSuccess={() => {}}
          onGoogleFailure={(err) => {
            loginState.setError(err instanceof Error ? err.message : 'Google Auth Initialization Error');
            loginState.setIsLoading(false);
          }}
          onNavigateToRegister={onNavigateToRegister}
        />
      )}
    </AuthLayout>
  );
}
