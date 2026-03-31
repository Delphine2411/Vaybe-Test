import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoBlock } from "@/components/dashboard/info-block";
import { InfoPill } from "@/components/dashboard/info-pill";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatDate } from "@/components/dashboard/utils";
import type { ApplicationRecord } from "@/lib/types";

export function ApplicationCard({
  application,
  onDelete,
  onOpen,
  isDeleting,
}: {
  application: ApplicationRecord;
  onDelete: (id: string) => void | Promise<void>;
  onOpen: (application: ApplicationRecord) => void;
  isDeleting: boolean;
}) {
  return (
    <SectionCard>
      <div className="flex flex-col gap-5 px-6 py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-semibold text-slate-950">
                {application.name}
              </h3>
              <StatusBadge status={application.status} />
            </div>
            <p className="mt-2 text-sm text-slate-500">{application.email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpen(application)}
              className="rounded-full"
            >
              <Eye className="size-4" />
              Voir detail
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void onDelete(application.id)}
              className="rounded-full border-rose-200 text-rose-600 hover:bg-rose-50"
              disabled={isDeleting}
            >
              <Trash2 className="size-4" />
              Supprimer
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <InfoPill label="Role" value={application.role} />
          <InfoPill label="Score" value={`${application.score}/3`} />
          <InfoPill label="Date" value={formatDate(application.createdAt)} />
        </div>

        <div>
          <p className="text-sm leading-7 text-slate-700">{application.motivation}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InfoBlock
            label="Portfolio"
            value={
              application.portfolio ? (
                <a
                  href={application.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-[var(--color-brand)] hover:underline"
                >
                  {application.portfolio}
                </a>
              ) : (
                "Non renseigne"
              )
            }
          />
          <InfoBlock
            label="CV"
            value={
              <a
                href={application.cv}
                target="_blank"
                rel="noreferrer"
                className="break-all text-[var(--color-brand)] hover:underline"
              >
                {application.cv}
              </a>
            }
          />
        </div>
      </div>
    </SectionCard>
  );
}
