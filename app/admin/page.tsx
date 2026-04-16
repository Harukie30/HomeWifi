import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminDashboard } from "@/app/admin/admin-dashboard";
import { LoginRedirectLoading } from "@/app/admin/login-redirect-loading";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    return <LoginRedirectLoading />;
  }

  return <AdminDashboard />;
}
