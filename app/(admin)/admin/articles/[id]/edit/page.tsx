import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createServerSupabaseClient, getUser } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin-auth";
import type { Article } from "@/lib/db-types";

export const dynamic = "force-dynamic";

async function updateArticle(formData: FormData) {
  "use server";

  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    redirect("/login");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/articles");
  }

  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    tags: String(formData.get("tags") ?? "").trim(),
    readTime: Number(formData.get("readTime") ?? 1) || 1,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    publishedAt: formData.get("published") === "on" ? new Date().toISOString() : null,
    coverImage: String(formData.get("coverImage") ?? "").trim() || null,
  };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("Article").update(payload).eq("id", id);
  if (error) {
    redirect(`/admin/articles/${id}/edit?error=article_update_failed`);
  }

  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  revalidatePath(`/articles/${payload.slug}`);
  redirect("/admin/articles?success=article_updated");
}

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("Article").select("*").eq("id", id).maybeSingle();

  if (error || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Edit Article</h1>
        <Card>
          <CardContent className="p-6 space-y-3">
            <p className="text-muted-foreground">Article not found.</p>
            <Button variant="outline" asChild>
              <Link href="/admin/articles">Back to Articles</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const article = data as Article;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Article</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/articles">Back to Articles</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Article</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateArticle} className="grid gap-4">
            <input type="hidden" name="id" defaultValue={article.id} />
            <Input name="title" defaultValue={article.title} required />
            <Input name="slug" defaultValue={article.slug} required />
            <Input name="category" defaultValue={article.category} required />
            <Input name="tags" defaultValue={article.tags} required />
            <Input name="readTime" type="number" min={1} defaultValue={article.readTime} required />
            <Input name="coverImage" defaultValue={article.coverImage ?? ""} placeholder="Cover image URL (optional)" />
            <Input name="excerpt" defaultValue={article.excerpt} required />
            <textarea
              name="content"
              className="min-h-[280px] w-full rounded-md border bg-background px-3 py-2 text-sm"
              defaultValue={article.content}
              required
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" defaultChecked={article.featured} /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked={article.published} /> Published
            </label>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
