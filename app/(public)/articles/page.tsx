import { redirect } from "next/navigation";

interface LegacyArticlesPageProps {
  searchParams: Promise<{ category?: string; search?: string; tag?: string }>;
}

export default async function LegacyArticlesPage({ searchParams }: LegacyArticlesPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  if (params.category) query.set("category", params.category);
  if (params.search) query.set("search", params.search);
  if (params.tag) query.set("tag", params.tag);

  const destination = query.toString() ? `/blogs?${query.toString()}` : "/blogs";
  redirect(destination);
}
