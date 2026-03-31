import type {
  ApplicationRecord,
  RoleFilter,
  SortOption,
} from "@/lib/types";
import type { DashboardStats, SortOrder } from "@/components/dashboard/types";

export function getDashboardStats(
  applications: ApplicationRecord[]
): DashboardStats {
  const total = applications.length;
  const devCount = applications.filter((application) => application.role === "dev").length;
  const designerCount = applications.filter(
    (application) => application.role === "designer"
  ).length;
  const avgScore =
    total > 0
      ? (
          applications.reduce((sum, application) => sum + application.score, 0) / total
        ).toFixed(1)
      : "0";

  return {
    total,
    devCount,
    designerCount,
    avgScore,
  };
}

export function filterAndSortApplications(
  applications: ApplicationRecord[],
  searchTerm: string,
  roleFilter: RoleFilter,
  sortBy: SortOption,
  sortOrder: SortOrder
) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredApplications = applications.filter((application) => {
    const matchesRole = roleFilter === "all" ? true : application.role === roleFilter;

    const matchesSearch = normalizedSearch
      ? [application.name, application.email, application.motivation]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch)
      : true;

    return matchesRole && matchesSearch;
  });

  const scorePriority = {
    "score-high": [3, 2, 1, 0],
    "score-medium": [2, 3, 1, 0],
    "score-low": [0, 1, 2, 3],
  }[sortBy];

  return filteredApplications.sort((left, right) => {
    const leftPriority = scorePriority.indexOf(left.score);
    const rightPriority = scorePriority.indexOf(right.score);

    const baseResult =
      leftPriority !== rightPriority
        ? leftPriority - rightPriority
        : new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();

    return sortOrder === "desc" ? baseResult : baseResult * -1;
  });
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
