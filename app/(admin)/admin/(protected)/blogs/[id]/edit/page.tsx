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
import type { Article } from "@/lib/db-types";

export const dynamic = "force-dynamic";

async function updateBlog(formData: FormData) {
  "use server";

  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/blogs");
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
    redirect(`/admin/blogs/${id}/edit?error=blog_update_failed`);
  }

  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  revalidatePath(`/blogs/${payload.slug}`);
  revalidatePath("/");
  redirect("/admin/blogs?success=blog_updated");
}

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("Article").select("*").eq("id", id).maybeSingle();

  if (error || !data) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Edit Blog" />
        <Card>
          <CardContent className="p-6 space-y-3">
            <p className="text-muted-foreground">Blog not found.</p>
            <Button variant="outline" asChild>
              <Link href="/admin/blogs">Back to Blogs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const article = data as Article;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Blog"
        description="Update blog content, metadata, and publish state."
        action={
          <Button variant="outline" asChild>
            <Link href="/admin/blogs">Back to Blogs</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Update Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateBlog} className="grid gap-4">
            <input type="hidden" name="id" defaultValue={article.id} />
            <Input name="title" defaultValue={article.title} required />
            <Input name="slug" defaultValue={article.slug} required />
            <Input name="category" defaultValue={article.category} required />
            <Input name="tags" defaultValue={article.tags} required />
            <Input name="readTime" type="number" min={1} defaultValue={article.readTime} required />
            <Input name="coverImage" defaultValue={article.coverImage ?? ""} placeholder="Cover image URL (optional)" />
            <Input name="excerpt" defaultValue={article.excerpt} required />
            <Textarea
              aria-label="blog content"
              name="content"
              className="min-h-[280px]"
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
