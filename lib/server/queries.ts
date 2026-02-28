import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Article, Contact, Project, Settings, WorkExperienceCard } from "@/lib/db-types";

export type ArticleCardData = Pick<
  Article,
  "id" | "title" | "slug" | "excerpt" | "coverImage" | "category" | "readTime" | "createdAt" | "publishedAt"
>;

export type ProjectCardData = Pick<
  Project,
  | "id"
  | "title"
  | "slug"
  | "shortDesc"
  | "category"
  | "status"
  | "liveUrl"
  | "githubUrl"
  | "coverImage"
  | "techStack"
  | "order"
>;

export type DashboardData = {
  counts: {
    articlesCount: number;
    publishedArticlesCount: number;
    projectsCount: number;
    messagesCount: number;
    experienceCount: number;
  };
  recentArticles: Pick<Article, "id" | "title" | "published" | "createdAt" | "category">[];
  recentMessages: Pick<Contact, "id" | "name" | "email" | "createdAt" | "message">[];
};

export const getFeaturedArticles = cache(async (limit = 3): Promise<ArticleCardData[]> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("Article")
    .select("id,title,slug,excerpt,coverImage,category,readTime,createdAt,publishedAt")
    .eq("featured", true)
    .eq("published", true)
    .order("publishedAt", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as ArticleCardData[];
});

export const getFeaturedProjects = cache(async (limit = 3): Promise<ProjectCardData[]> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("Project")
    .select("id,title,slug,shortDesc,category,status,liveUrl,githubUrl,coverImage,techStack,order")
    .eq("featured", true)
    .order("order", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as ProjectCardData[];
});

export const getWorkExperienceCards = cache(async (): Promise<WorkExperienceCard[]> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("WorkExperienceCard")
    .select("id,company,role,location,description,achievements,skills,startDate,endDate,current,order")
    .order("order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as WorkExperienceCard[];
});

export const getProfileData = cache(async (): Promise<{
  settings: Settings | null;
  experienceCards: WorkExperienceCard[];
}> => {
  const supabase = await createServerSupabaseClient();
  const [settingsResult, experienceResult] = await Promise.all([
    supabase
      .from("Settings")
      .select(
        "id,resumeUrl,linkedinUrl,githubUrl,twitterUrl,emailAddress,heroTitle,heroSubtitle,techHeroTitle,techHeroSubtitle,aboutMe,profileImage,updatedAt"
      )
      .limit(1)
      .maybeSingle(),
    supabase
      .from("WorkExperienceCard")
      .select("id,company,role,location,description,achievements,skills,startDate,endDate,current,order")
      .order("order", { ascending: true }),
  ]);

  if (settingsResult.error) throw settingsResult.error;
  if (experienceResult.error) throw experienceResult.error;

  return {
    settings: (settingsResult.data as Settings | null) ?? null,
    experienceCards: (experienceResult.data ?? []) as WorkExperienceCard[],
  };
});

export const getPublishedArticles = cache(
  async (category?: string, search?: string, tag?: string): Promise<ArticleCardData[]> => {
    const supabase = await createServerSupabaseClient();
    let query = supabase
      .from("Article")
      .select("id,title,slug,excerpt,coverImage,category,readTime,createdAt,publishedAt")
      .eq("published", true)
      .order("publishedAt", { ascending: false, nullsFirst: false });

    if (category) {
      query = query.eq("category", category);
    }

    if (search) {
      const escaped = search.replace(/,/g, "\\,");
      query = query.or(`title.ilike.%${escaped}%,excerpt.ilike.%${escaped}%`);
    }

    if (tag) {
      const escapedTag = tag.replace(/,/g, "\\,");
      query = query.ilike("tags", `%${escapedTag}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as ArticleCardData[];
  }
);

export const getPublishedArticleCategories = cache(async (): Promise<string[]> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("Article").select("category").eq("published", true);
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((row) => row.category)));
});

export const getProjects = cache(async (): Promise<ProjectCardData[]> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("Project")
    .select("id,title,slug,shortDesc,category,status,liveUrl,githubUrl,coverImage,techStack,order")
    .order("order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProjectCardData[];
});

export const getProjectCategories = cache(async (): Promise<string[]> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("Project").select("category");
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((row) => row.category)));
});

export const getPublishedArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("Article")
    .select("id,title,slug,excerpt,content,coverImage,tags,category,published,featured,readTime,createdAt,updatedAt,publishedAt")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return (data as Article | null) ?? null;
});

export const getDashboardData = cache(async (): Promise<DashboardData> => {
  const supabase = await createServerSupabaseClient();
  const [articlesCountResult, publishedCountResult, projectsCountResult, messagesCountResult, experienceCountResult] =
    await Promise.all([
      supabase.from("Article").select("id", { count: "exact", head: true }),
      supabase.from("Article").select("id", { count: "exact", head: true }).eq("published", true),
      supabase.from("Project").select("id", { count: "exact", head: true }),
      supabase.from("Contact").select("id", { count: "exact", head: true }),
      supabase.from("WorkExperienceCard").select("id", { count: "exact", head: true }),
    ]);

  const countErrors = [
    articlesCountResult.error,
    publishedCountResult.error,
    projectsCountResult.error,
    messagesCountResult.error,
    experienceCountResult.error,
  ].filter(Boolean);
  if (countErrors.length > 0) throw countErrors[0];

  const [{ data: recentArticleRows, error: recentArticlesError }, { data: recentMessageRows, error: recentMessagesError }] =
    await Promise.all([
      supabase
        .from("Article")
        .select("id,title,published,createdAt,category")
        .order("createdAt", { ascending: false })
        .limit(5),
      supabase
        .from("Contact")
        .select("id,name,email,createdAt,message")
        .order("createdAt", { ascending: false })
        .limit(5),
    ]);

  if (recentArticlesError) throw recentArticlesError;
  if (recentMessagesError) throw recentMessagesError;

  return {
    counts: {
      articlesCount: articlesCountResult.count ?? 0,
      publishedArticlesCount: publishedCountResult.count ?? 0,
      projectsCount: projectsCountResult.count ?? 0,
      messagesCount: messagesCountResult.count ?? 0,
      experienceCount: experienceCountResult.count ?? 0,
    },
    recentArticles: (recentArticleRows ?? []) as DashboardData["recentArticles"],
    recentMessages: (recentMessageRows ?? []) as DashboardData["recentMessages"],
  };
});
