import { Mail, User } from 'lucide-react';
import AuthField from '@/features/auth/components/shared/AuthField';

interface RegisterAccountFieldsProps {
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  organization: string;
  setOrganization: (value: string) => void;
  countries: string[];
  isLoading: boolean;
}

/** Renders or coordinates register account fields for this frontend module. */
export default function RegisterAccountFields(props: RegisterAccountFieldsProps) {
  return (
    <>
      <AuthField label="Full Name" value={props.fullName} onChange={props.setFullName} icon={User} placeholder="Alexander Mercer" disabled={props.isLoading} />
      <AuthField label="Email address" value={props.email} onChange={props.setEmail} icon={Mail} placeholder="name@example.com" type="email" disabled={props.isLoading} />
    </>
  );
}

/** Renders the account identity fields used by the registration form. */
