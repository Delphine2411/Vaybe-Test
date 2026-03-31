"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness, Palette, Users } from "lucide-react";
import { ApplicationsTable } from "@/components/dashboard/applications-table";
import { DetailModal } from "@/components/dashboard/detail-modal";
import { EmptyState } from "@/components/dashboard/empty-state";
import { FiltersCard } from "@/components/dashboard/filters-card";
import { DashboardHeader } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { filterAndSortApplications, getDashboardStats } from "@/components/dashboard/utils";
import { useToast } from "@/components/ui/toast";
import { useApplicationsApi } from "@/hooks/use-applications-api";
import type { SortOrder } from "@/components/dashboard/types";
import type {
  AdminDashboardProps,
  ApplicationRecord,
  RoleFilter,
  SortOption,
} from "@/lib/types";

export function AdminDashboard({ initialApplications }: AdminDashboardProps) {
  const { toast } = useToast();
  const {
    deleteApplication,
    clearApplications,
    updateApplicationStatus,
    isDeletingApplication,
    isClearingApplications,
    isUpdatingApplicationStatus,
  } = useApplicationsApi();
  const [applications, setApplications] =
    useState<ApplicationRecord[]>(initialApplications);
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("score-high");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const stats = useMemo(() => getDashboardStats(applications), [applications]);

  const filteredAndSortedApplications = useMemo(
    () =>
      filterAndSortApplications(
        applications,
        searchTerm,
        roleFilter,
        sortBy,
        sortOrder
      ),
    [applications, roleFilter, searchTerm, sortBy, sortOrder]
  );

  function toggleSortOrder() {
    setSortOrder((current) => (current === "desc" ? "asc" : "desc"));
  }

  function requestDeleteConfirmation(id: string) {
    toast({
      variant: "warning",
      title: "Supprimer cette candidature ?",
      description: "Cette action est definitive et supprimera le dossier.",
      duration: 0,
      actions: [
        {
          label: "Annuler",
          variant: "outline",
          onClick: () => {},
        },
        {
          label: "Supprimer",
          variant: "destructive",
          onClick: () => {
            void performDelete(id);
          },
        },
      ],
    });
  }

  async function performDelete(id: string) {
    try {
      await deleteApplication(id);

      setApplications((current) =>
        current.filter((application) => application.id !== id)
      );

      if (selectedApplication?.id === id) {
        setSelectedApplication(null);
        setShowRejectForm(false);
        setRejectionReason("");
      }

      toast({
        variant: "success",
        title: "Candidature supprimée",
        description: "Le dossier a bien été retiré de la liste.",
      });
    } catch (error) {
      toast({
        variant: "error",
        title: "Suppression impossible",
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue pendant la suppression.",
      });
    }
  }

  function requestClearAllConfirmation() {
    toast({
      variant: "warning",
      title: "Supprimer toutes les candidatures ?",
      description: "Cette action est definitive et videra tout le tableau.",
      duration: 0,
      actions: [
        {
          label: "Annuler",
          variant: "outline",
          onClick: () => {},
        },
        {
          label: "Tout supprimer",
          variant: "destructive",
          onClick: () => {
            void performClearAll();
          },
        },
      ],
    });
  }

  async function performClearAll() {
    try {
      await clearApplications();

      setApplications([]);
      setSelectedApplication(null);
      setShowRejectForm(false);
      setRejectionReason("");

      toast({
        variant: "success",
        title: "Toutes les candidatures ont été supprimées",
        description: "Le tableau a bien été vidé.",
      });
    } catch (error) {
      toast({
        variant: "error",
        title: "Suppression impossible",
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue pendant la suppression.",
      });
    }
  }

  function openDetails(application: ApplicationRecord) {
    setSelectedApplication(application);
    setShowRejectForm(false);
    setRejectionReason(application.rejectionReason || "");
  }

  async function handleDecision(
    status: "validated" | "rejected",
    currentRejectionReason = ""
  ) {
    if (!selectedApplication) {
      return;
    }

    try {
      const payload = await updateApplicationStatus(selectedApplication.id, {
        status,
        rejectionReason: currentRejectionReason,
      });

      setApplications((current) =>
        current.map((application) =>
          application.id === payload.data.id ? payload.data : application
        )
      );

      setSelectedApplication(payload.data);
      setShowRejectForm(false);
      setRejectionReason("");

      toast({
        variant: payload.email.sent
          ? "success"
          : payload.email.error
            ? "error"
            : "info",
        title:
          status === "validated"
            ? "Candidature validée"
            : "Candidature rejetée",
        description: payload.email.sent
          ? "Décision enregistrée et email envoyé au candidat."
          : payload.email.error
            ? `Décision enregistrée, mais l'email n'a pas pu être envoyé: ${payload.email.error}`
            : "Décision enregistrée. L'envoi email a été simulé côté serveur.",
      });
    } catch (error) {
      toast({
        variant: "error",
        title: "Mise à jour impossible",
        description:
          error instanceof Error
            ? error.message
            : "Impossible de traiter cette action.",
      });
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-2">
        <div className="mx-auto max-w-7xl">
          <DashboardHeader
            applicationsCount={applications.length}
            isClearingAll={isClearingApplications}
            onClearAll={requestClearAllConfirmation}
          />

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
            <StatsCard
              title="Total"
              value={String(stats.total)}
              description="candidatures recues"
              icon={<Users className="h-4 w-4 text-slate-400" />}
              onClick={() => setRoleFilter("all")}
              isActive={roleFilter === "all"}
            />
            <StatsCard
              title="Developpeurs"
              value={String(stats.devCount)}
              description={
                stats.total > 0
                  ? `${((stats.devCount / stats.total) * 100).toFixed(0)}% du total`
                  : "aucune candidature"
              }
              icon={<BriefcaseBusiness className="h-4 w-4 text-blue-500" />}
              onClick={() => setRoleFilter("dev")}
              isActive={roleFilter === "dev"}
            />
            <StatsCard
              title="Designers"
              value={String(stats.designerCount)}
              description={
                stats.total > 0
                  ? `${((stats.designerCount / stats.total) * 100).toFixed(0)}% du total`
                  : "aucune candidature"
              }
              icon={<Palette className="h-4 w-4 text-purple-500" />}
              onClick={() => setRoleFilter("designer")}
              isActive={roleFilter === "designer"}
            />
          </div>

          <FiltersCard
            applicationsCount={applications.length}
            searchTerm={searchTerm}
            roleFilter={roleFilter}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSearchTermChange={setSearchTerm}
            onRoleFilterChange={setRoleFilter}
            onSortByChange={setSortBy}
            onToggleSortOrder={toggleSortOrder}
          />

          {filteredAndSortedApplications.length === 0 ? (
            <EmptyState hasApplications={applications.length > 0} />
          ) : (
            <div className="space-y-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  {filteredAndSortedApplications.length} candidature(s) trouvee(s)
                </p>
              </div>

              <ApplicationsTable
                applications={filteredAndSortedApplications}
                onDelete={requestDeleteConfirmation}
                onOpen={openDetails}
                isDeleting={isDeletingApplication}
              />
            </div>
          )}
        </div>
      </div>

      <DetailModal
        application={selectedApplication}
        showRejectForm={showRejectForm}
        rejectionReason={rejectionReason}
        isSubmittingDecision={isUpdatingApplicationStatus}
        onClose={() => setSelectedApplication(null)}
        onToggleRejectForm={() => setShowRejectForm((current) => !current)}
        onRejectionReasonChange={setRejectionReason}
        onValidate={() => void handleDecision("validated")}
        onReject={() => void handleDecision("rejected", rejectionReason)}
      />
    </>
  );
}
