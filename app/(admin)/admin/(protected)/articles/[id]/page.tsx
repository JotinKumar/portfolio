import { redirect } from "next/navigation";

interface AdminArticleRedirectPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminArticleRedirectPage({ params }: AdminArticleRedirectPageProps) {
  const { id } = await params;
  redirect(`/admin/blogs/${id}/edit`);
}
