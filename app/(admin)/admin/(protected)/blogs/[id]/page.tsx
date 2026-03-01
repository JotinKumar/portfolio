import { redirect } from "next/navigation";

interface AdminBlogRedirectPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminBlogRedirectPage({ params }: AdminBlogRedirectPageProps) {
  const { id } = await params;
  redirect(`/admin/blogs/${id}/edit`);
}
