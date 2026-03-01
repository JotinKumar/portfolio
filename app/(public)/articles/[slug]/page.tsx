import { redirect } from "next/navigation";

interface LegacyArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LegacyArticleDetailPage({ params }: LegacyArticleDetailPageProps) {
  const { slug } = await params;
  redirect(`/blogs/${slug}`);
}
