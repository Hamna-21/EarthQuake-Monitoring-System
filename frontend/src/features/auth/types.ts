export interface PasswordStrength {
  score: number;
  text: string;
  color: string;
}

export interface RegisterFormProps {
  fullName: string;
  setFullName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (pass: string) => void;
  confirmPassword: string;
  setConfirmPassword: (pass: string) => void;
  country: string;
  setCountry: (country: string) => void;
  organization: string;
  setOrganization: (org: string) => void;
  acceptTerms: boolean;
  setAcceptTerms: (val: boolean) => void;
  receiveAlerts: boolean;
  setReceiveAlerts: (val: boolean) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  passwordStrength: PasswordStrength;
  countries: string[];
  error: string;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleStart: () => void;
  onGoogleSuccess: (url: string) => void;
  onGoogleFailure: (err: any) => void;
  onNavigateToLogin: () => void;
}
