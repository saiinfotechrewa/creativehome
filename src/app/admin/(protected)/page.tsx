import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { DashboardView } from "@/components/admin/dashboard/dashboard-view";

export const dynamic = "force-dynamic";

/**
 * Admin dashboard. The shell (sidebar + topbar + account menu) is provided by
 * `(protected)/layout.tsx`; this page resolves the viewer's permissions and
 * hands them to the client widget grid so leads / activity panels are gated.
 */
export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  return (
    <DashboardView
      userName={user?.name || user?.email || "there"}
      canViewLeads={can(user?.permissions, PERMISSIONS.LEADS_VIEW)}
      canViewActivity={can(user?.permissions, PERMISSIONS.ACTIVITY_VIEW)}
    />
  );
}
