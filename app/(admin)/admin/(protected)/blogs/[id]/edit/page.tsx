import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowLeft, Calendar, Clock, FileText, Tag } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isAdminEmail } from "@/lib/admin-auth";
import type { Article } from "@/lib/db-types";
import { createServerSupabaseClient, getUser } from "@/lib/supabase-server";

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
  const { error } = await supabase.from("Blog").update(payload).eq("id", id);
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
  const { data, error } = await supabase.from("Blog").select("*").eq("id", id).maybeSingle();

  if (error || !data) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Edit Blog" />
        <Card>
          <CardContent className="space-y-3 p-6">
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
  const updatedDate = new Date(article.updatedAt).toLocaleDateString();
  const publishedDate = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Draft";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Blog"
        description="Edit the article in the same broad rhythm as the public page: hero, media, taxonomy, then the full body."
        action={
          <Button variant="outline" asChild>
            <Link href="/admin/blogs">Back to Blogs</Link>
          </Button>
        }
      />

      <form action={updateBlog} className="space-y-6">
        <input type="hidden" name="id" defaultValue={article.id} />

        <section className="space-y-4 rounded-2xl border bg-card/70 p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/blogs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blogs
              </Link>
            </Button>
            <div className="flex flex-wrap gap-2">
              <Badge variant={article.published ? "default" : "secondary"}>{article.published ? "Published" : "Draft"}</Badge>
              <Badge variant="outline">Editor view</Badge>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="space-y-4">
              <Input
                name="title"
                defaultValue={article.title}
                required
                className="h-auto border-0 px-0 text-3xl font-black tracking-tight shadow-none focus-visible:ring-0 md:text-5xl"
              />
              <Textarea
                name="excerpt"
                defaultValue={article.excerpt}
                required
                className="min-h-[96px] border-0 px-0 text-base text-muted-foreground shadow-none focus-visible:ring-0 md:text-lg"
              />
            </div>

            <div className="space-y-4 rounded-2xl border border-border/60 bg-background/70 p-4">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Meta</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Updated {updatedDate}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Public date {publishedDate}
                </div>
              </div>
              <Input name="readTime" type="number" min={1} defaultValue={article.readTime} required />
              <Input name="category" defaultValue={article.category} required />
              <Input name="slug" defaultValue={article.slug} required />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border bg-muted/35 p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <FileText className="h-4 w-4" />
            Cover media
          </div>
          <Input name="coverImage" defaultValue={article.coverImage ?? ""} placeholder="Cover image URL (optional)" />
        </section>

        <section className="space-y-4 rounded-2xl border bg-background/80 p-6 md:p-8">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Tag className="h-4 w-4" />
            Taxonomy
          </div>
          <Input name="tags" defaultValue={article.tags} required />
        </section>

        <section className="space-y-4 rounded-2xl border bg-background/80 p-6 md:p-8">
          <h2 className="text-xl font-semibold md:text-2xl">Article Body</h2>
          <Textarea
            aria-label="blog content"
            name="content"
            className="min-h-[360px] whitespace-pre-wrap"
            defaultValue={article.content}
            required
          />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" defaultChecked={article.featured} /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked={article.published} /> Published
            </label>
            <Button type="submit">Save Changes</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
