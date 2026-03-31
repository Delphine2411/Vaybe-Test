import { CheckCheck, CircleX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailCard } from "@/components/dashboard/detail-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatDate } from "./utils";
import type { ApplicationRecord } from "@/lib/types";

export function DetailModal({
  application,
  showRejectForm,
  rejectionReason,
  isSubmittingDecision,
  onClose,
  onToggleRejectForm,
  onRejectionReasonChange,
  onValidate,
  onReject,
}: {
  application: ApplicationRecord | null;
  showRejectForm: boolean;
  rejectionReason: string;
  isSubmittingDecision: boolean;
  onClose: () => void;
  onToggleRejectForm: () => void;
  onRejectionReasonChange: (value: string) => void;
  onValidate: () => void;
  onReject: () => void;
}) {
  if (!application) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/55 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-4xl rounded-[2rem] bg-white p-6 shadow-[0_40px_120px_rgba(15,23,42,0.28)] md:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-semibold text-slate-950">
                {application.name}
              </h3>
              <StatusBadge status={application.status} />
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Candidature recue le {formatDate(application.createdAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-11 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="grid gap-4">
            <DetailCard label="E-mail" content={application.email} />
            <DetailCard label="Role" content={application.role} />
            <DetailCard label="Score" content={`${application.score}/3`} />
            <DetailCard
              label="Portfolio"
              content={
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
            <DetailCard
              label="CV"
              content={
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

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Message de motivation
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              {application.motivation}
            </p>

            {application.status === "rejected" && application.rejectionReason ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
                <p className="font-semibold">Motif de rejet</p>
                <p className="mt-2 leading-6">{application.rejectionReason}</p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3">
              <Button
                type="button"
                size="lg"
                onClick={onValidate}
                disabled={isSubmittingDecision}
                className="h-12 rounded-full bg-[var(--color-brand)] text-white hover:bg-emerald-700"
              >
                <CheckCheck className="size-4" />
                Valider
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onToggleRejectForm}
                disabled={isSubmittingDecision}
                className="h-12 rounded-full border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                <CircleX className="size-4" />
                Rejeter
              </Button>
            </div>

            {showRejectForm ? (
              <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Raison du rejet
                  <textarea
                    value={rejectionReason}
                    onChange={(event) => onRejectionReasonChange(event.target.value)}
                    placeholder="Saisissez la raison du rejet."
                    className="min-h-32 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--color-brand)] focus:bg-white"
                  />
                </label>

                <Button
                  type="button"
                  size="lg"
                  onClick={onReject}
                  disabled={isSubmittingDecision}
                  className="mt-4 h-12 w-full rounded-full bg-slate-950 text-white hover:bg-slate-800"
                >
                  Valider le rejet
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
