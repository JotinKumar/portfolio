import Link from 'next/link';
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createServerSupabaseClient, getUser } from '@/lib/supabase-server';
import type { Article } from '@/lib/db-types';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import { isAdminEmail } from "@/lib/admin-auth";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';

async function deleteArticle(formData: FormData) {
  "use server";

  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    redirect("/login");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/articles?error=invalid_article_id");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("Article").delete().eq("id", id);

  if (error) {
    redirect("/admin/articles?error=article_delete_failed");
  }

  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  redirect("/admin/articles?success=article_deleted");
}

export default async function ArticlesAdmin() {
  let articles: Article[] = [];
  
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('Article')
      .select('*')
      .order('createdAt', { ascending: false });
    if (error) {
      throw error;
    }
    articles = (data ?? []) as Article[];
  } catch {
    console.log('Database not available, using empty state');
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Articles</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and articles.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/articles/new">
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Card key={article.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-lg">{article.title}</h3>
                    <Badge variant={article.published ? 'default' : 'secondary'}>
                      {article.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Category: {article.category}</span>
                    <span>•</span>
                    <span>Read time: {article.readTime} min</span>
                    <span>•</span>
                    <span>Created: {new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {article.tags.split(',').filter(Boolean).map((tag: string) => (
                      <Badge key={tag.trim()} variant="outline" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {article.published && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/articles/${article.slug}`} target="_blank">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/articles/${article.id}/edit`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <form action={deleteArticle}>
                    <input type="hidden" name="id" value={article.id} />
                    <Button size="sm" variant="destructive" type="submit">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <h3 className="font-semibold">No articles yet</h3>
              <p className="text-muted-foreground">
                Get started by creating your first article.
              </p>
              <Button asChild>
                <Link href="/admin/articles/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Article
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
