import AuthPasswordField from '../../shared/AuthPasswordField';
import { PasswordStrength } from '../registerTypes';

interface RegisterPasswordFieldsProps {
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  passwordStrength: PasswordStrength;
  isLoading: boolean;
}

export default function RegisterPasswordFields(props: RegisterPasswordFieldsProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <AuthPasswordField label="Passphrase" value={props.password} onChange={props.setPassword} show={props.showPassword} setShow={props.setShowPassword} disabled={props.isLoading} />
        <AuthPasswordField label="Confirm Passphrase" value={props.confirmPassword} onChange={props.setConfirmPassword} show={props.showConfirmPassword} setShow={props.setShowConfirmPassword} disabled={props.isLoading} />
      </div>
      {props.password && (
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
            <span>Passphrase Integrity</span>
            <span className="text-white">{props.passwordStrength.text}</span>
          </div>
          <div className="h-2 rounded-full bg-black/30">
            <div
              className={`h-full rounded-full ${props.passwordStrength.color} transition-all duration-500`}
              style={{ width: `${(props.passwordStrength.score / 4) * 100}%` }}
            />
          </div>
        </div>
      )}
    </>
  );
}
