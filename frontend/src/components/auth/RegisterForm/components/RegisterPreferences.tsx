interface RegisterPreferencesProps {
  acceptTerms: boolean;
  setAcceptTerms: (value: boolean) => void;
  receiveAlerts: boolean;
  setReceiveAlerts: (value: boolean) => void;
}

export default function RegisterPreferences(props: RegisterPreferencesProps) {
  return (
    <div className="space-y-3">
      <label className="flex items-start gap-3 text-xs leading-6 text-slate-400">
        <input type="checkbox" checked={props.acceptTerms} onChange={(event) => props.setAcceptTerms(event.target.checked)} className="mt-1 h-4 w-4 accent-cyan-400" />
        Authorize early warning telemetry alerts and data coordination standards.
      </label>
      <label className="flex items-start gap-3 text-xs leading-6 text-slate-400">
        <input type="checkbox" checked={props.receiveAlerts} onChange={(event) => props.setReceiveAlerts(event.target.checked)} className="mt-1 h-4 w-4 accent-cyan-400" />
        Receive urgent magnitude 5+ alert mailings.
      </label>
    </div>
  );
}
