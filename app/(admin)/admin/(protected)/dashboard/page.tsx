import Link from "next/link";
import { ArrowRight, FileText, FolderOpen, Mail, User } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Article, Contact } from "@/lib/db-types";
import { getDashboardData } from "@/lib/server/queries";

export const revalidate = 60;

type RecentArticle = Pick<Article, "id" | "title" | "published" | "createdAt" | "category">;
type RecentMessage = Pick<Contact, "id" | "name" | "email" | "createdAt" | "message">;

export default async function AdminDashboard() {
  let articlesCount = 0;
  let publishedArticlesCount = 0;
  let projectsCount = 0;
  let messagesCount = 0;
  let experienceCount = 0;
  let recentArticles: RecentArticle[] = [];
  let recentMessages: RecentMessage[] = [];

  try {
    const dashboard = await getDashboardData();
    articlesCount = dashboard.counts.articlesCount;
    publishedArticlesCount = dashboard.counts.publishedArticlesCount;
    projectsCount = dashboard.counts.projectsCount;
    messagesCount = dashboard.counts.messagesCount;
    experienceCount = dashboard.counts.experienceCount;
    recentArticles = dashboard.recentArticles as RecentArticle[];
    recentMessages = dashboard.recentMessages as RecentMessage[];
  } catch {
    console.log("Database not available, using empty state");
  }

  const stats = [
    {
      title: "Total Blogs",
      value: articlesCount,
      description: `${publishedArticlesCount} published`,
      icon: FileText,
      href: "/admin/blogs",
      tone: "from-[#f2e5cf] via-[#f8f1e5] to-background",
    },
    {
      title: "Projects",
      value: projectsCount,
      description: "Total projects",
      icon: FolderOpen,
      href: "/admin/projects",
      tone: "from-[#d8e8df] via-[#eef7f1] to-background",
    },
    {
      title: "Messages",
      value: messagesCount,
      description: "Contact messages",
      icon: Mail,
      href: "/admin/messages",
      tone: "from-[#dfe7f4] via-[#eff3fb] to-background",
    },
    {
      title: "Experience",
      value: experienceCount,
      description: "Work experiences",
      icon: User,
      href: "/admin/experience",
      tone: "from-[#eadfd7] via-[#f7efe9] to-background",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Jump directly into the sections that need attention, then review the latest content and conversations below."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className="group">
            <Card className={`h-full overflow-hidden border-border/70 bg-gradient-to-br ${stat.tone} transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_18px_36px_-30px_rgba(15,23,42,0.45)]`}>
              <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                <div className="space-y-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className="text-4xl font-semibold tracking-tight text-foreground">{stat.value}</div>
                </div>
                <span className="flex size-11 items-center justify-center rounded-full border border-foreground/10 bg-background/70 text-foreground">
                  <stat.icon className="h-5 w-5" />
                </span>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4 pt-0">
                <p className="text-sm text-muted-foreground">{stat.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Recent Blogs</CardTitle>
            <CardDescription>Open drafts or published entries from the latest batch.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentArticles.length > 0 ? (
              recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/admin/blogs/${article.id}/edit`}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-transparent bg-muted/35 px-4 py-3 transition-colors hover:border-border hover:bg-muted/60"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{article.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {article.category} · {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={article.published ? "default" : "secondary"}>
                    {article.published ? "Published" : "Draft"}
                  </Badge>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No blogs yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Latest contact form submissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMessages.length > 0 ? (
              recentMessages.map((message) => (
                <Link
                  key={message.id}
                  href="/admin/messages"
                  className="block rounded-2xl border border-transparent bg-muted/35 px-4 py-3 transition-colors hover:border-border hover:bg-muted/60"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">{message.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(message.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{message.email}</p>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{message.message}</p>
                </Link>
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
