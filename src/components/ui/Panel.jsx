export function Panel({ title, children }) {
  return <section className="min-h-full rounded-xl border border-[#e3cda129] bg-[#110d0a29] p-4"><h3 className="mb-3 text-[11px] uppercase tracking-[0.2em] text-[#c2a979]">{title}</h3>{children}</section>;
}
