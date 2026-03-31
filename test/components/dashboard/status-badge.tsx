import type { ApplicationRecord } from "@/lib/types";

export function StatusBadge({ status }: { status: ApplicationRecord["status"] }) {
  const labels = {
    pending: "en attente",
    validated: "valide",
    rejected: "rejete",
  };

  const styles = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    validated: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
