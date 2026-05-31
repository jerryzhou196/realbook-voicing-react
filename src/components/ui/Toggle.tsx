interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center justify-between gap-3 py-2 text-sm text-[#eadaba]">
      <span>{label}</span>
      <button
        type="button"
        aria-pressed={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full border border-[#6c543e] p-1 transition ${checked ? 'bg-[#546747]' : 'bg-[#221a14]'}`}
      >
        <span className={`block h-[18px] w-[18px] rounded-full transition ${checked ? 'translate-x-5 bg-[#efddb1]' : 'translate-x-0 bg-[#baa889]'}`} />
      </button>
    </label>
  );
}
