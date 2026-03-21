import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase-server";
import { AdminSidebar } from "@/components/admin/sidebar";
import { isAdminEmail } from "@/lib/admin-auth";
import { AdminActionToast } from "@/components/admin/action-toast";
import { APP_SHELL_CLASS } from "@/lib/layout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin");
  }

  return (
    <div className={`${APP_SHELL_CLASS} py-8`}>
      <div className="overflow-hidden border border-border/70 bg-background/92">
        <AdminSidebar />
        <main className="min-h-[calc(100vh-13rem)]">
          <AdminActionToast />
          <div className="p-5 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
