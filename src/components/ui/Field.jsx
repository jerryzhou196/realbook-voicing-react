export function Field({ label, children, className = '' }) {
  return <label className={`mb-3 flex flex-col gap-1.5 text-[10px] uppercase tracking-[0.16em] text-[#cab38b] ${className}`}><span>{label}</span>{children}</label>;
}
export function TextInput(props) {
  return <input {...props} className="w-full rounded-md border border-[#6b543f] bg-[#efe1c1] px-3 py-2.5 font-book text-sm normal-case tracking-normal text-[#2d241a] outline-none focus:border-[#d4b674]" />;
}
export function Select({ children, ...props }) {
  return <select {...props} className="w-full rounded-md border border-[#6b543f] bg-[#efe1c1] px-3 py-2.5 font-book text-sm normal-case tracking-normal text-[#2d241a] outline-none focus:border-[#d4b674]">{children}</select>;
}
