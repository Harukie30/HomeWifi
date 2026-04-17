import { isAdminAuthenticated } from "@/lib/admin-auth";
import { WifiUsersPage } from "@/components/admin/wifi-users-page";
import { LoginRedirectLoading } from "@/app/admin/login-redirect-loading";

export default async function AdminWifiUsersRoutePage() {
  if (!(await isAdminAuthenticated())) {
    return <LoginRedirectLoading />;
  }

  return <WifiUsersPage />;
}
