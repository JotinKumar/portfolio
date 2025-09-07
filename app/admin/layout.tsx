import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase-server";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
