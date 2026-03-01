import { redirect } from "next/navigation";

export default function LegacyAdminArticlesPage() {
  redirect("/admin/blogs");
}
