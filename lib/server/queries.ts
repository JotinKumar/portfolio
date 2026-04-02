import { cache } from "react";
import { createServerSupabaseClient, createServerSupabasePublicClient } from "@/lib/supabase-server";
import { groupSocialLinksByPosition, normalizeSocialLink, type SocialLinkRow } from "@/lib/social-links";
import type {
  Article,
  Contact,
  HeroContent,
  NavigationItem,
  PageContent,
  ProfileMilestone,
  Project,
  PublicPage,
  SiteConfig,
  SocialLink,
  WorkExperienceCard,
} from "@/lib/db-types";

export type ArticleCardData = Pick<
  Article,
  "id" | "title" | "slug" | "excerpt" | "coverImage" | "category" | "authorName" | "authorAvatar" | "readTime" | "createdAt" | "publishedAt"
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

export type SiteShellData = {
  siteConfig: SiteConfig | null;
  headerNav: NavigationItem[];
  footerQuickLinks: NavigationItem[];
  footerResourceLinks: NavigationItem[];
  footerLegalLinks: NavigationItem[];
  footerSocialLinks: SocialLink[];
  contactSocialLinks?: SocialLink[];
  profileSocialLinks?: SocialLink[];
};

export const getFeaturedArticles = cache(async (limit = 3): Promise<ArticleCardData[]> => {
  const supabase = createServerSupabasePublicClient();
  const { data, error } = await supabase
    .from("Blog")
    .select("id,title,slug,excerpt,coverImage,category,authorName,authorAvatar,readTime,createdAt,publishedAt,featured")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("publishedAt", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw error;

  return ((data ?? []) as (ArticleCardData & { featured: boolean })[]).map(({ featured: _featured, ...article }) => article);
});

export const getFeaturedProjects = cache(async (limit = 3): Promise<ProjectCardData[]> => {
  const supabase = createServerSupabasePublicClient();
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
  const supabase = createServerSupabasePublicClient();
  const { data, error } = await supabase
    .from("WorkExperienceCard")
    .select("id,company,role,location,description,achievements,skills,startDate,endDate,current,order")
    .order("order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as WorkExperienceCard[];
});

export const getProfileMilestones = cache(async (): Promise<ProfileMilestone[]> => {
  const supabase = createServerSupabasePublicClient();
  const { data, error } = await supabase
    .from("ProfileMilestone")
    .select("id,title,month,year,order,visible,createdAt,updatedAt")
    .eq("visible", true)
    .order("order", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as ProfileMilestone[];
});



export const getSiteShellData = cache(async (): Promise<SiteShellData> => {
  const supabase = createServerSupabasePublicClient();
  const [siteConfigResult, navResult, socialResult] = await Promise.all([
    supabase
      .from("SiteConfig")
      .select(
        "id,siteName,siteTagline,logoUrl,logoAlt,resumeUrl,primaryEmail,phone,locationLabel,defaultTitle,defaultDescription,updatedAt"
      )
      .eq("id", "default")
      .maybeSingle(),
    supabase
      .from("NavigationItem")
      .select("id,label,href,order,position,visible,isExternal,openInNewTab,createdAt,updatedAt")
      .eq("visible", true)
      .order("order", { ascending: true }),
    supabase
      .from("SocialLink")
      .select("*")
      .eq("visible", true)
      .order("order", { ascending: true }),
  ]);

  if (siteConfigResult.error) throw siteConfigResult.error;
  if (navResult.error) throw navResult.error;
  if (socialResult.error) throw socialResult.error;

  const navItems = (navResult.data ?? []) as NavigationItem[];
  const socialItems = (socialResult.data ?? []).map((item) => normalizeSocialLink(item as SocialLinkRow));
  const socialGroups = groupSocialLinksByPosition(socialItems);

  return {
    siteConfig: (siteConfigResult.data as SiteConfig | null) ?? null,
    headerNav: navItems.filter((item) => item.position === "HEADER"),
    footerQuickLinks: navItems.filter((item) => item.position === "FOOTER_QUICK"),
    footerResourceLinks: navItems.filter((item) => item.position === "FOOTER_RESOURCE"),
    footerLegalLinks: navItems.filter((item) => item.position === "FOOTER_LEGAL"),
    footerSocialLinks: socialGroups.FOOTER,
    contactSocialLinks: socialGroups.CONTACT,
    profileSocialLinks: socialGroups.PROFILE,
  };
});

export const getHeroContent = cache(async (): Promise<HeroContent | null> => {
  const supabase = createServerSupabasePublicClient();
  const { data, error } = await supabase
    .from("HeroContent")
    .select(
      "id,displayName,professionalTitle,professionalSubtitle,techTitle,techSubtitle,professionalSkills,professionalInitialSkills,techSkills,techInitialSkills,professionalImageUrl,techImageUrl,exploreProfessionalLabel,exploreTechLabel,resetViewLabel,downloadResumeLabel,getInTouchLabel,viewProjectsLabel,viewArticlesLabel,homeWorkSectionTitle,homeFeaturedArticlesTitle,homeFeaturedProjectsTitle,homeViewAllArticlesLabel,homeViewAllProjectsLabel,updatedAt"
    )
    .eq("id", "default")
    .maybeSingle();

  if (error) throw error;
  return (data as HeroContent | null) ?? null;
});

export const getPageContent = cache(async (page: PublicPage): Promise<PageContent | null> => {
  const supabase = createServerSupabasePublicClient();
  const { data, error } = await supabase
    .from("PageContent")
    .select("id,page,title,subtitle,emptyTitle,emptyMessage,primaryCta,secondaryCta,content,createdAt,updatedAt")
    .eq("page", page)
    .maybeSingle();

  if (error) throw error;
  return (data as PageContent | null) ?? null;
});



export const getSocialLinksByPosition = cache(async (position: "FOOTER" | "CONTACT" | "PROFILE"): Promise<SocialLink[]> => {
  const supabase = createServerSupabasePublicClient();
  const { data, error } = await supabase
    .from("SocialLink")
    .select("*")
    .eq("position", position)
    .eq("visible", true)
    .order("order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((item) => normalizeSocialLink(item as SocialLinkRow));
});

export const getPublishedArticles = cache(
  async (category?: string, search?: string, tag?: string): Promise<ArticleCardData[]> => {
    const supabase = createServerSupabasePublicClient();
    let query = supabase
      .from("Blog")
      .select("id,title,slug,excerpt,coverImage,category,authorName,authorAvatar,readTime,createdAt,publishedAt")
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
  const supabase = createServerSupabasePublicClient();
  const { data, error } = await supabase.from("Blog").select("category").eq("published", true);
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((row) => row.category)));
});

export const getPublishedArticleTags = cache(async (): Promise<string[]> => {
  const supabase = createServerSupabasePublicClient();
  const { data, error } = await supabase.from("Blog").select("tags").eq("published", true);
  if (error) throw error;
  
  const allTags = new Set<string>();
  (data ?? []).forEach(row => {
    if (row.tags) {
      row.tags.split(',').forEach((tag: string) => {
        const trimmed = tag.trim();
        if (trimmed) allTags.add(trimmed);
      });
    }
  });
  
  return Array.from(allTags).sort();
});

export const getProjects = cache(async (): Promise<ProjectCardData[]> => {
  const supabase = createServerSupabasePublicClient();
  const { data, error } = await supabase
    .from("Project")
    .select("id,title,slug,shortDesc,category,status,liveUrl,githubUrl,coverImage,techStack,order")
    .order("order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProjectCardData[];
});

export const getProjectCategories = cache(async (): Promise<string[]> => {
  const supabase = createServerSupabasePublicClient();
  const { data, error } = await supabase.from("Project").select("category");
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((row) => row.category)));
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const supabase = createServerSupabasePublicClient();
  const { data, error } = await supabase
    .from("Project")
    .select(
      "id,title,slug,description,shortDesc,category,status,order,featured,liveUrl,githubUrl,coverImage,screenshots,techStack,tags,createdAt,updatedAt"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return (data as Project | null) ?? null;
});

export const getPublishedArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  const supabase = createServerSupabasePublicClient();
  const { data, error } = await supabase
    .from("Blog")
    .select("id,title,slug,excerpt,content,coverImage,tags,category,authorName,authorAvatar,published,featured,readTime,createdAt,updatedAt,publishedAt")
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
      supabase.from("Blog").select("id", { count: "exact", head: true }),
      supabase.from("Blog").select("id", { count: "exact", head: true }).eq("published", true),
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
        .from("Blog")
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

