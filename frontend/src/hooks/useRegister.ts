import { useState, useEffect } from 'react';
import { COUNTRIES } from '../constants/countries';

interface UseRegisterProps {
  onSuccess: (email: string, token: string, name?: string) => void;
}

export function useRegister({ onSuccess }: UseRegisterProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [organization, setOrganization] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [receiveAlerts, setReceiveAlerts] = useState(true);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Listen for Google SSO Auth redirects or messages
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
            throw new Error(errData.error || 'Failed to authorize ');
          }
          
          const data = await response.json();
          setRegisterSuccess(true);
          setTimeout(() => {
            setIsLoading(false);
            onSuccess(data.user.email, data.token, data.user.name);
          }, 1500);
        } catch (err: any) {
          setError(err.message || 'SSO registration error');
          setIsLoading(false);
        }
      } else if (event.data?.type === 'GOOGLE_AUTH_SUCCESS_REAL') {
        const { token, email, name } = event.data;
        setRegisterSuccess(true);
        setTimeout(() => {
          setIsLoading(false);
          onSuccess(email, token, name);
        }, 1500);
      }
    };

    window.addEventListener('message', handleSSOMessage);
    return () => window.removeEventListener('message', handleSSOMessage);
  }, [onSuccess]);

  // Live password strength
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: 'No password', color: 'bg-red-900/40' });

  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, text: 'No password', color: 'bg-red-900/20' });
      return;
    }
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let text = 'Weak';
    let color = 'bg-red-600';
    if (score === 2) {
      text = 'Medium';
      color = 'bg-orange-500';
    } else if (score === 3) {
      text = 'Strong';
      color = 'bg-yellow-500';
    } else if (score === 4) {
      text = 'Highly Secure';
      color = 'bg-emerald-500 animate-pulse';
    }

    setPasswordStrength({ score, text, color });
  }, [password]);

  const countries = COUNTRIES;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName) {
      setError('Please provide your Full Name.');
      return;
    }
    if (!email) {
      setError('Please provide your Security Email coordinates.');
      return;
    }
    if (!password) {
      setError('Please establish a secure Passphrase.');
      return;
    }
    if (password.length < 8) {
      setError('Passphrase must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passphrases do not match. Verify your security entry.');
      return;
    }
    if (!acceptTerms) {
      setError('You must accept the early warning telemetry guidelines.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email address configuration.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: fullName,
          country,
          organization
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Instantiation failed');
      }

      const data = await response.json();
      setRegisterSuccess(true);
      setTimeout(() => {
        setIsLoading(false);
        onSuccess(data.user.email, data.token, data.user.name);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Error occurred registering system keys.');
      setIsLoading(false);
    }
  };

  return {
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
    error,
    setError,
    isLoading,
    setIsLoading,
    registerSuccess,
    passwordStrength,
    countries,
    handleRegisterSubmit,
  };
}
