import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Article, Contact } from '@/lib/db-types';
import { FileText, FolderOpen, Mail, User } from 'lucide-react';

// Use Incremental Static Regeneration (ISR)
export const revalidate = 60; // Revalidate every minute for admin dashboard

type RecentArticle = Pick<Article, 'id' | 'title' | 'published' | 'createdAt' | 'category'>;
type RecentMessage = Pick<Contact, 'id' | 'name' | 'email' | 'createdAt' | 'message'>;

export default async function AdminDashboard() {
  let articlesCount = 0;
  let publishedArticlesCount = 0;
  let projectsCount = 0;
  let messagesCount = 0;
  let experienceCount = 0;
  let recentArticles: RecentArticle[] = [];
  let recentMessages: RecentMessage[] = [];
  
  try {
    const supabase = await createServerSupabaseClient();

    // Fetch dashboard stats
    const [articlesCountResult, publishedCountResult, projectsCountResult, messagesCountResult, experienceCountResult] =
      await Promise.all([
        supabase.from('Article').select('*', { count: 'exact', head: true }),
        supabase.from('Article').select('*', { count: 'exact', head: true }).eq('published', true),
        supabase.from('Project').select('*', { count: 'exact', head: true }),
        supabase.from('Contact').select('*', { count: 'exact', head: true }),
        supabase.from('WorkExperience').select('*', { count: 'exact', head: true }),
      ]);

    const countErrors = [
      articlesCountResult.error,
      publishedCountResult.error,
      projectsCountResult.error,
      messagesCountResult.error,
      experienceCountResult.error,
    ].filter(Boolean);
    if (countErrors.length > 0) {
      throw countErrors[0];
    }

    articlesCount = articlesCountResult.count ?? 0;
    publishedArticlesCount = publishedCountResult.count ?? 0;
    projectsCount = projectsCountResult.count ?? 0;
    messagesCount = messagesCountResult.count ?? 0;
    experienceCount = experienceCountResult.count ?? 0;

    // Fetch recent articles
    const { data: recentArticleRows, error: recentArticlesError } = await supabase
      .from('Article')
      .select('*')
      .order('createdAt', { ascending: false })
      .limit(5);
    if (recentArticlesError) {
      throw recentArticlesError;
    }
    recentArticles = ((recentArticleRows ?? []) as Article[]).map((article) => ({
      id: article.id,
      title: article.title,
      published: article.published,
      createdAt: article.createdAt,
      category: article.category,
    }));

    // Fetch recent messages
    const { data: recentMessageRows, error: recentMessagesError } = await supabase
      .from('Contact')
      .select('*')
      .order('createdAt', { ascending: false })
      .limit(5);
    if (recentMessagesError) {
      throw recentMessagesError;
    }
    recentMessages = ((recentMessageRows ?? []) as Contact[]).map((message) => ({
      id: message.id,
      name: message.name,
      email: message.email,
      createdAt: message.createdAt,
      message: message.message,
    }));
  } catch {
    console.log('Database not available, using empty state');
  }

  const stats = [
    {
      title: 'Total Articles',
      value: articlesCount,
      description: `${publishedArticlesCount} published`,
      icon: FileText,
    },
    {
      title: 'Projects',
      value: projectsCount,
      description: 'Total projects',
      icon: FolderOpen,
    },
    {
      title: 'Messages',
      value: messagesCount,
      description: 'Contact messages',
      icon: Mail,
    },
    {
      title: 'Experience',
      value: experienceCount,
      description: 'Work experiences',
      icon: User,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Articles</CardTitle>
            <CardDescription>Your latest blog posts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentArticles.length > 0 ? (
              recentArticles.map((article) => (
                <div key={article.id} className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {article.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {article.category} • {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={article.published ? 'default' : 'secondary'}>
                    {article.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No articles yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Latest contact form submissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMessages.length > 0 ? (
              recentMessages.map((message) => (
                <div key={message.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {message.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {message.email}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {message.message}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
