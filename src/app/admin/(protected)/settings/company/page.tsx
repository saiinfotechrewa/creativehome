import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { CompanySettingsForm } from "@/components/admin/settings/company-settings-form";

export const dynamic = "force-dynamic";

/**
 * Company Settings. Requires `settings:view` to open; `settings:manage` unlocks
 * the editing controls (otherwise the form renders read-only).
 */
export default async function CompanySettingsPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.SETTINGS_VIEW)) notFound();

  return (
    <CompanySettingsForm
      canManage={can(user?.permissions, PERMISSIONS.SETTINGS_MANAGE)}
    />
  );
}
