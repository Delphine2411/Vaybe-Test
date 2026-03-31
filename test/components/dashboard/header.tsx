import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";

export function DashboardHeader({
  applicationsCount,
  isClearingAll,
  onClearAll,
}: {
  applicationsCount: number;
  isClearingAll: boolean;
  onClearAll: () => void;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-end">
        <BrandLogo />
      </div>
      <Button asChild variant="ghost" className="mb-4">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au formulaire
        </Link>
      </Button>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-brand)]">
            Tableau de bord
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Gestion des candidatures recues
          </p>
        </div>

        {applicationsCount > 0 ? (
          <Button
            variant="destructive"
            onClick={onClearAll}
            className="gap-2"
            disabled={isClearingAll}
          >
            <Trash2 className="h-4 w-4" />
            {isClearingAll ? "Suppression..." : "Tout supprimer"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
