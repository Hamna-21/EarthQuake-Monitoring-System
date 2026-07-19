import { Building2, Globe, Mail, User } from 'lucide-react';
import AuthField from '../../shared/AuthField';

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

export default function RegisterAccountFields(props: RegisterAccountFieldsProps) {
  return (
    <>
      <AuthField label="Full Name" value={props.fullName} onChange={props.setFullName} icon={User} placeholder="Alexander Mercer" disabled={props.isLoading} />
      <AuthField label="Security Email" value={props.email} onChange={props.setEmail} icon={Mail} placeholder="alex@geopulse.com" type="email" disabled={props.isLoading} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Monitor Region</span>
          <span className="relative block">
            <Globe className="absolute left-4 top-3.5 h-4 w-4 text-cyan-100/50" />
            <select
              value={props.country}
              onChange={(event) => props.setCountry(event.target.value)}
              className="w-full appearance-none rounded-2xl border border-white/10 bg-black/25 py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-cyan-300"
              disabled={props.isLoading}
            >
              {props.countries.map((country) => <option key={country} className="bg-slate-950">{country}</option>)}
            </select>
          </span>
        </label>
        <AuthField label="Affiliated Agency" value={props.organization} onChange={props.setOrganization} icon={Building2} placeholder="Research Organization" disabled={props.isLoading} />
      </div>
    </>
  );
}
