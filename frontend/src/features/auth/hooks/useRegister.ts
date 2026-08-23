import { FormEvent, useEffect, useState } from 'react';
import { COUNTRIES } from '@/constants/countries';
import { registerRequest } from '@/features/auth/services/authService';
import { calculatePasswordStrength } from '@/features/auth/utils/passwordStrength';
import { useGoogleAuthMessages } from '@/features/auth/hooks/useGoogleAuthMessages';

interface UseRegisterProps {
  onSuccess: (email: string, token: string, name?: string) => void;
}

/** Validates register before the UI action continues. */
function validateRegister(values: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  if (!values.fullName) return 'Please provide your Full Name.';
  if (!values.email) return 'Please provide your Email address coordinates.';
  if (!values.password) return 'Please establish a secure Passphrase.';
  if (values.password.length < 8) return 'Passphrase must be at least 8 characters long.';
  if (values.password !== values.confirmPassword) return 'Passphrases do not match.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return 'Invalid email address configuration.';
  return '';
}

/** Handles use register and keeps the related frontend state or data flow consistent. */
export function useRegister({ onSuccess }: UseRegisterProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [organization, setOrganization] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(calculatePasswordStrength(''));

  useGoogleAuthMessages({
    onSuccess,
    setError,
    setIsLoading,
    setSuccess: setRegisterSuccess,
    fallbackError: 'SSO registration error',
  });

  useEffect(() => {
    // Recalculate password feedback only when the password changes.
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  const handleRegisterSubmit = async (event: FormEvent) => {
    // Validate the profile locally before creating the account through the shared auth service.
    event.preventDefault();
    const validationError = validateRegister({ fullName, email, password, confirmPassword });
    if (validationError) return setError(validationError);
    setError('');
    setIsLoading(true);

    try {
      const data = await registerRequest({ email, password, name: fullName, country, organization });
      setRegisterSuccess(true);
      window.setTimeout(() => {
        setIsLoading(false);
        onSuccess(data.user.email, data.token, data.user.name);
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error occurred registering system keys.');
      setIsLoading(false);
    }
  };

  return {
    fullName, setFullName, email, setEmail, password, setPassword,
    confirmPassword, setConfirmPassword, country, setCountry,
    organization, setOrganization, showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword, error, setError,
    isLoading, setIsLoading, registerSuccess, passwordStrength,
    countries: COUNTRIES, handleRegisterSubmit,
  };
}
