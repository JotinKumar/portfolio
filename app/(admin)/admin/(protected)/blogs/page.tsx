import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowUpRight, Edit, Eye, Plus, Trash } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { isAdminEmail } from "@/lib/admin-auth";
import type { Article } from "@/lib/db-types";
import { createServerSupabaseClient, getUser } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

async function deleteBlog(formData: FormData) {
  "use server";

  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/blogs?error=invalid_blog_id");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("Blog").delete().eq("id", id);

  if (error) {
    redirect("/admin/blogs?error=blog_delete_failed");
  }

  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  revalidatePath("/");
  redirect("/admin/blogs?success=blog_deleted");
}

function BlogAdminSection({
  title,
  description,
  articles,
}: {
  title: string;
  description: string;
  articles: Article[];
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <h2 className="type-card-title text-[1.45rem]">{title}</h2>
          <p className="type-body text-muted-foreground">{description}</p>
        </div>
        <Badge variant="outline" className="rounded-full px-3 py-1 text-xs tracking-[0.14em] uppercase">
          {articles.length} items
        </Badge>
      </div>

      <div className="grid gap-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Card key={article.id} className="overflow-hidden border-border/70 bg-card/78 p-0">
              <div className="grid gap-4 p-6 lg:grid-cols-[minmax(0,1fr)_auto]">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={article.published ? "default" : "secondary"}>
                      {article.published ? "Published" : "Draft"}
                    </Badge>
                    <Badge variant="outline">{article.category}</Badge>
                    <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {article.readTime} min read
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/admin/blogs/${article.id}/edit`}
                        className="type-card-title text-[1.45rem] transition-colors hover:text-primary"
                      >
                        {article.title}
                      </Link>
                      {article.published ? (
                        <Link
                          href={`/blogs/${article.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          Preview
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      ) : null}
                    </div>
                    <p className="type-body max-w-[70ch] text-muted-foreground">{article.excerpt}</p>
                  </div>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span>Created {new Date(article.createdAt).toLocaleDateString()}</span>
                    {article.publishedAt ? <span>Published {new Date(article.publishedAt).toLocaleDateString()}</span> : null}
                    <span>Slug: /blogs/{article.slug}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {article.tags
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                      .map((tag) => (
                        <Badge key={`${article.id}-${tag}`} variant="outline" className="text-xs text-muted-foreground">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className="flex flex-row items-start gap-2 lg:flex-col lg:items-stretch">
                  {article.published ? (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/blogs/${article.slug}`} target="_blank" aria-label={`View blog ${article.title}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Link>
                    </Button>
                  ) : null}
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/blogs/${article.id}/edit`} aria-label={`Edit blog ${article.title}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <form action={deleteBlog}>
                    <input type="hidden" name="id" value={article.id} />
                    <Button size="sm" variant="destructive" type="submit" aria-label={`Delete blog ${article.title}`}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="border-dashed border-border/70 p-8">
            <p className="type-body text-muted-foreground">No entries in this section yet.</p>
          </Card>
        )}
      </div>
    </section>
  );
}

export default async function BlogsAdmin() {
  let articles: Article[] = [];

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("Blog")
      .select("*")
      .order("published", { ascending: false })
      .order("publishedAt", { ascending: false, nullsFirst: false })
      .order("createdAt", { ascending: false });
    if (error) {
      throw error;
    }
    articles = (data ?? []) as Article[];
  } catch {
    console.log("Database not available, using empty state");
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Blogs"
        description="Manage published stories and current drafts from one editorial workspace."
        action={
          <Button asChild>
            <Link href="/admin/blogs/new">
              <Plus className="mr-2 h-4 w-4" />
              New Blog
            </Link>
          </Button>
        }
      />

      {articles.length > 0 ? (
        <div className="space-y-10">
          <BlogAdminSection
            title="Published"
            description="Live posts that are already visible on the public blogs page."
            articles={articles.filter((article) => article.published)}
          />
          <BlogAdminSection
            title="Draft"
            description="Work in progress entries that are still private in the admin area."
            articles={articles.filter((article) => !article.published)}
          />
        </div>
      ) : (
        <div className="grid gap-4">
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <h3 className="font-semibold">No blogs yet</h3>
              <p className="text-muted-foreground">Get started by creating your first blog.</p>
              <Button asChild>
                <Link href="/admin/blogs/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Blog
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
