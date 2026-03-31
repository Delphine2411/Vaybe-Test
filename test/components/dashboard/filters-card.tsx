import { Search, SlidersHorizontal, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/dashboard/section-card";
import type { RoleFilter, SortOption } from "@/lib/types";
import type { SortOrder } from "@/components/dashboard/types";

export function FiltersCard({
  applicationsCount,
  searchTerm,
  roleFilter,
  sortBy,
  sortOrder,
  onSearchTermChange,
  onRoleFilterChange,
  onSortByChange,
  onToggleSortOrder,
}: {
  applicationsCount: number;
  searchTerm: string;
  roleFilter: RoleFilter;
  sortBy: SortOption;
  sortOrder: SortOrder;
  onSearchTermChange: (value: string) => void;
  onRoleFilterChange: (value: RoleFilter) => void;
  onSortByChange: (value: SortOption) => void;
  onToggleSortOrder: () => void;
}) {
  return (
    <SectionCard className="mb-6">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          <h2 className="text-lg font-semibold text-slate-950">
            Filtres et recherche
          </h2>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Affinez votre recherche parmi les {applicationsCount} candidature(s)
        </p>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Rechercher par nom, email ou motivation..."
                value={searchTerm}
                onChange={(event) => onSearchTermChange(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[var(--color-brand)] focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <select
            value={roleFilter}
            onChange={(event) =>
              onRoleFilterChange(event.target.value as RoleFilter)
            }
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[var(--color-brand)] focus:ring-4 focus:ring-blue-100"
          >
            <option value="all">Tous les roles</option>
            <option value="dev">Developpeur</option>
            <option value="designer">Designer</option>
          </select>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(event) => onSortByChange(event.target.value as SortOption)}
              className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[var(--color-brand)] focus:ring-4 focus:ring-blue-100"
            >
              <option value="score-high">Score élevé</option>
              <option value="score-medium">Score moyen</option>
              <option value="score-low">Score faible</option>
            </select>
            <Button variant="outline" size="icon" onClick={onToggleSortOrder}>
              {sortOrder === "desc" ? (
                <TrendingDown className="h-4 w-4" />
              ) : (
                <TrendingUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
