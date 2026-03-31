import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/dashboard/section-card";
import { formatDate } from "@/components/dashboard/utils";
import type { ApplicationRecord } from "@/lib/types";

export function ApplicationsTable({
  applications,
  onOpen,
  onDelete,
  isDeleting,
}: {
  applications: ApplicationRecord[];
  onOpen: (application: ApplicationRecord) => void;
  onDelete: (id: string) => void | Promise<void>;
  isDeleting: boolean;
}) {
  return (
    <SectionCard>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">E-mail</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Score</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {applications.map((application, index) => (
              <ApplicationsTableRow
                key={application.id}
                application={application}
                rowIndex={index}
                onOpen={onOpen}
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function ApplicationsTableRow({
  application,
  rowIndex,
  onOpen,
  onDelete,
  isDeleting,
}: {
  application: ApplicationRecord;
  rowIndex: number;
  onOpen: (application: ApplicationRecord) => void;
  onDelete: (id: string) => void | Promise<void>;
  isDeleting: boolean;
}) {
  const avatarStyles = [
    "bg-[#dce9ff] text-[#5f79c9]",
    "bg-[#ffe5d3] text-[#c87a49]",
    "bg-[#fff3c7] text-[#b08a19]",
    "bg-[#f2dcff] text-[#9a5ec1]",
    "bg-[#d7f7eb] text-[#3a9a7a]",
  ];

  return (
    <tr className="transition hover:bg-slate-50/80">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className={`grid size-9 place-items-center rounded-full text-xs font-semibold ${avatarStyles[rowIndex % avatarStyles.length]}`}
          >
            {application.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-950">{application.email}</p>
            <p className="mt-1 text-xs text-slate-400">{application.name}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          {application.role}
        </span>
      </td>

      <td className="px-6 py-5">
        <span className="inline-flex rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#5b6fda]">
          {application.score}/3
        </span>
      </td>

      <td className="px-6 py-5 text-sm text-slate-600">
        {formatDate(application.createdAt)}
      </td>

      <td className="px-6 py-5">
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
      </td>
    </tr>
  );
}
