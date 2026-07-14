import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout/AuthLayout';
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import ForgotPasswordForm from '../../components/auth/ForgotPassword/ForgotPasswordForm';
import LoginSuccessOverlay from '../../components/auth/LoginForm/LoginSuccessOverlay';
import { useLogin } from '../../hooks/useLogin';

interface LoginProps {
  onSuccess: (email: string, token: string, name?: string) => void;
  onNavigateToRegister: () => void;
  onBackToHome: () => void;
}

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
          rememberMe={loginState.rememberMe}
          setRememberMe={loginState.setRememberMe}
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
            loginState.setError(err.message || 'Google Auth Initialization Error');
            loginState.setIsLoading(false);
          }}
          onNavigateToRegister={onNavigateToRegister}
        />
      )}
    </AuthLayout>
  );
}
