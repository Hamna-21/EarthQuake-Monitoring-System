import { Building2, Globe, Mail, User } from 'lucide-react';
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
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 flex min-h-8 items-end text-[10px] font-black uppercase leading-4 tracking-[0.2em] text-slate-400">Monitor Region</span>
          <span className="relative block">
            <Globe className="absolute left-4 top-3.5 h-4 w-4 text-cyan-100/50" />
            <select
              value={props.country}
              onChange={(event) => props.setCountry(event.target.value)}
              className="h-[50px] w-full appearance-none rounded-none border border-white/10 bg-black/25 pl-12 pr-4 text-sm text-white outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
              disabled={props.isLoading}
            >
              {props.countries.map((country) => <option key={country} className="bg-slate-950">{country}</option>)}
            </select>
          </span>
        </label>
        <AuthField label="Research group or agency" value={props.organization} onChange={props.setOrganization} icon={Building2} placeholder="Research group or agency" labelClassName="min-h-8 items-end flex leading-4" disabled={props.isLoading} />
      </div>
    </>
  );
}

/** Renders the account identity fields used by the registration form. */
