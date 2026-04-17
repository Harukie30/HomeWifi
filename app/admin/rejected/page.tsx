import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminRejectedPage } from "@/components/admin/admin-rejected-page";
import { LoginRedirectLoading } from "@/app/admin/login-redirect-loading";

export default async function AdminRejectedRoutePage() {
  if (!(await isAdminAuthenticated())) {
    return <LoginRedirectLoading />;
  }

  return <AdminRejectedPage />;
}
