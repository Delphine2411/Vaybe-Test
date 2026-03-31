import type { ReactNode } from "react";

export function DetailCard({
  label,
  content,
}: {
  label: string;
  content: ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </div>
      <div className="mt-3 text-sm leading-6 text-slate-800">{content}</div>
    </div>
  );
}
