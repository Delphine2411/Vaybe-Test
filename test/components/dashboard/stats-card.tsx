import type { ReactNode } from "react";
import { SectionCard } from "@/components/dashboard/section-card";

export function StatsCard({
  title,
  value,
  description,
  icon,
  onClick,
  isActive = false,
}: {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className="group block h-full w-full appearance-none bg-transparent p-0 text-left outline-none"
    >
      <SectionCard
        className={`h-full transition-all ${
          isActive
            ? "border-[var(--color-brand)] bg-[#edf4ff] shadow-[0_16px_40px_rgba(0,71,187,0.14)]"
            : "hover:border-slate-300 hover:shadow-md"
        }`}
      >
        <div className="flex items-center justify-between px-6 pb-2 pt-5">
          <h2
            className={`text-sm font-medium ${
              isActive ? "text-[var(--color-brand)]" : "text-slate-700"
            }`}
          >
            {title}
          </h2>
          {icon}
        </div>
        <div className="px-6 pb-5">
          <div
            className={`text-2xl font-semibold ${
              isActive ? "text-[var(--color-brand-strong)]" : "text-slate-950"
            }`}
          >
            {value}
          </div>
          <p className={`mt-1 text-xs ${isActive ? "text-slate-600" : "text-slate-500"}`}>
            {description}
          </p>
        </div>
      </SectionCard>
    </button>
  );
}
