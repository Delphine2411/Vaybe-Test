import Link from "next/link";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/dashboard/section-card";

export function EmptyState({ hasApplications }: { hasApplications: boolean }) {
  return (
    <SectionCard>
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <Users className="mb-4 h-16 w-16 text-slate-300" />
        <h3 className="text-xl font-semibold text-slate-950">Aucune candidature</h3>
        <p className="mt-2 max-w-lg text-slate-500">
          {hasApplications
            ? "Aucune candidature ne correspond a vos criteres de recherche"
            : "Il n'y a pas encore de candidatures soumises"}
        </p>
        {!hasApplications ? (
          <Button asChild className="mt-6">
            <Link href="/">Creer une candidature</Link>
          </Button>
        ) : null}
      </div>
    </SectionCard>
  );
}
