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
    redirect("/login");
  }

  return (
    <div className={`${APP_SHELL_CLASS} py-8`}>
      <div className="flex min-h-[calc(100vh-10rem)] overflow-hidden rounded-2xl border bg-background/90">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <AdminActionToast />
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
