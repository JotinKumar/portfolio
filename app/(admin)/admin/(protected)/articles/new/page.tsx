import { redirect } from "next/navigation";

export default function LegacyAdminNewArticlePage() {
  redirect("/admin/blogs/new");
}
