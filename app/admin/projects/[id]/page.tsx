import { redirect } from "next/navigation";

interface AdminProjectRedirectPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProjectRedirectPage({ params }: AdminProjectRedirectPageProps) {
  const { id } = await params;
  redirect(`/admin/projects/${id}/edit`);
}
