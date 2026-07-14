import { useState, useEffect } from 'react';

interface UseLoginProps {
  onSuccess: (email: string, token: string, name?: string) => void;
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

  // Listen for Google Auth redirects or messages
  useEffect(() => {
    const handleSSOMessage = async (event: MessageEvent) => {
      const origin = event.origin;
      if (origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS_MOCK') {
        const { email, name, country } = event.data;
        try {
          setIsLoading(true);
          const response = await fetch('/api/auth/google/sandbox-callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, country })
          });
          
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Failed to authorize sandbox token');
          }
          
          const data = await response.json();
          setLoginSuccess(true);
          setTimeout(() => {
            setIsLoading(false);
            onSuccess(data.user.email, data.token, data.user.name);
          }, 1500);
        } catch (err: any) {
          setError(err.message || 'SSO error');
          setIsLoading(false);
        }
      } else if (event.data?.type === 'GOOGLE_AUTH_SUCCESS_REAL') {
        const { token, email, name } = event.data;
        setLoginSuccess(true);
        setTimeout(() => {
          setIsLoading(false);
          onSuccess(email, token, name);
        }, 1500);
      }
    };

    window.addEventListener('message', handleSSOMessage);
    return () => window.removeEventListener('message', handleSSOMessage);
  }, [onSuccess]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Coordinates check failed');
      }

      const data = await response.json();
      setLoginSuccess(true);
      setTimeout(() => {
        setIsLoading(false);
        onSuccess(data.user.email, data.token, data.user.name);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Connection error. Please try again.');
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setError('Please enter your email address to reset.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResetSuccess(true);
      setTimeout(() => {
        setForgotPasswordStep(false);
        setResetSuccess(false);
        setError('');
      }, 3000);
    }, 1500);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    error,
    setError,
    isLoading,
    setIsLoading,
    loginSuccess,
    forgotPasswordStep,
    setForgotPasswordStep,
    resetEmail,
    setResetEmail,
    resetSuccess,
    handleLoginSubmit,
    handleForgotPasswordSubmit,
  };
}
