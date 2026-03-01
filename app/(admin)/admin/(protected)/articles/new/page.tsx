import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminPageHeader } from "@/components/admin/page-header";
import { createServerSupabaseClient, getUser } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createArticle(formData: FormData) {
  "use server";

  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin");
  }

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugInput || slugify(title);

  if (!title || !slug) {
    redirect("/admin/articles/new?error=missing_required_fields");
  }

  const payload = {
    title,
    slug,
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
  const { error } = await supabase.from("Article").insert(payload);
  if (error) {
    redirect("/admin/articles/new?error=article_create_failed");
  }

  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  revalidatePath("/");
  redirect("/admin/articles?success=article_created");
}

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="New Article"
        description="Create a new article draft or publish it immediately."
        action={
          <Button variant="outline" asChild>
            <Link href="/admin/articles">Back to Articles</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Create Article</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createArticle} className="grid gap-4">
            <Input name="title" placeholder="Title" required />
            <Input name="slug" placeholder="Slug (optional, auto-generated)" />
            <Input name="category" placeholder="Category" required />
            <Input name="tags" placeholder="Tags (comma separated)" required />
            <Input name="readTime" type="number" min={1} defaultValue={5} required />
            <Input name="coverImage" placeholder="Cover image URL (optional)" />
            <Input name="excerpt" placeholder="Short excerpt" required />
            <Textarea
              aria-label="article content"
              name="content"
              className="min-h-[280px]"
              placeholder="Article content"
              required
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" /> Publish now
            </label>
            <Button type="submit">Create Article</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
