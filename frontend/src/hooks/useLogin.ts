import { FormEvent, useState } from 'react';
import { loginRequest } from '../utils/authApi';
import { useGoogleAuthMessages } from './useGoogleAuthMessages';

interface UseLoginProps {
  onSuccess: (email: string, token: string, name?: string) => void;
}

function validateLogin(email: string, password: string) {
  if (!email) return 'Please enter your email address.';
  if (!password) return 'Please enter your password.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
  return '';
}

export function useLogin({ onSuccess }: UseLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  useGoogleAuthMessages({
    onSuccess,
    setError,
    setIsLoading,
    setSuccess: setLoginSuccess,
    fallbackError: 'SSO error',
  });

  const handleLoginSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validateLogin(email, password);
    if (validationError) return setError(validationError);
    setError('');
    setIsLoading(true);

    try {
      const data = await loginRequest(email, password);
      setLoginSuccess(true);
      window.setTimeout(() => {
        setIsLoading(false);
        onSuccess(data.user.email, data.token, data.user.name);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Connection error. Please try again.');
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!resetEmail) return setError('Please enter your email address to reset.');
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setResetSuccess(true);
      window.setTimeout(() => {
        setForgotPasswordStep(false);
        setResetSuccess(false);
        setError('');
      }, 3000);
    }, 1500);
  };

  return {
    email, setEmail, password, setPassword, showPassword, setShowPassword,
    rememberMe, setRememberMe, error, setError, isLoading, setIsLoading,
    loginSuccess, forgotPasswordStep, setForgotPasswordStep,
    resetEmail, setResetEmail, resetSuccess,
    handleLoginSubmit, handleForgotPasswordSubmit,
  };
}
