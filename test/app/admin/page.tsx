import { AdminDashboard } from "@/components/admin-dashboard";
import { listApplications } from "@/lib/applications";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const applications = listApplications();

  return (
    <AdminDashboard initialApplications={applications} />
  );
}
