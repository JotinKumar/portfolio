import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase-server";
import { AdminSidebar } from "@/components/admin/sidebar";
import { isAdminEmail } from "@/lib/admin-auth";
import { AdminActionToast } from "@/components/admin/action-toast";

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
    <div className="flex min-h-[calc(100vh-2rem)] bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <AdminActionToast />
        <div className="max-w-[1280px] mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
