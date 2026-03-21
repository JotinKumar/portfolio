import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseSecretClient } from "@/lib/supabase-secret";
import { getUser } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SettingsSection } from "@/components/admin/settings-section";
import { FileUploadField } from "@/components/admin/file-upload-field";
import { HeroContentMatrix } from "@/components/admin/hero-content-matrix";
import { PublicPageContentList } from "@/components/admin/public-page-content-list";
import { SocialSettingsTable } from "@/components/admin/social-settings-table";
import type { HeroContent, PageContent, PublicPage, SiteConfig, SocialLink } from "@/lib/db-types";

export const dynamic = "force-dynamic";

const PUBLIC_PAGE_ORDER: PublicPage[] = ["HOME", "PROFILE", "ARTICLES", "PROJECTS", "CONTACT"];

async function assertAdmin() {
  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin");
  }
}

function revalidateAllPublic() {
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/blogs");
  revalidatePath("/projects");
  revalidatePath("/contact");
}

function parseCSV(input: string): string[] {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function sortPages(pages: PageContent[]) {
  return [...pages].sort((left, right) => PUBLIC_PAGE_ORDER.indexOf(left.page) - PUBLIC_PAGE_ORDER.indexOf(right.page));
}

async function updateSiteConfig(formData: FormData) {
  "use server";

  await assertAdmin();
  const supabase = createSupabaseSecretClient();

  const payload = {
    siteName: normalizeText(formData.get("siteName")),
    siteTagline: normalizeText(formData.get("siteTagline")),
    logoUrl: normalizeText(formData.get("logoUrl")),
    logoAlt: normalizeText(formData.get("logoAlt")),
    resumeUrl: normalizeText(formData.get("resumeUrl")),
    primaryEmail: normalizeText(formData.get("primaryEmail")),
    locationLabel: normalizeText(formData.get("locationLabel")),
    defaultTitle: normalizeText(formData.get("defaultTitle")),
    defaultDescription: normalizeText(formData.get("defaultDescription")),
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabase.from("SiteConfig").update(payload).eq("id", "default");
  if (error) {
    redirect("/admin/settings?error=site_config_update_failed");
  }

  revalidateAllPublic();
  redirect("/admin/settings?success=site_config_updated");
}

async function updateHeroContent(formData: FormData) {
  "use server";

  await assertAdmin();
  const supabase = createSupabaseSecretClient();

  const payload = {
    displayName: normalizeText(formData.get("displayName")),
    professionalTitle: normalizeText(formData.get("professionalTitle")),
    professionalSubtitle: normalizeText(formData.get("professionalSubtitle")),
    techTitle: normalizeText(formData.get("techTitle")),
    techSubtitle: normalizeText(formData.get("techSubtitle")),
    professionalSkills: parseCSV(normalizeText(formData.get("professionalSkills"))),
    professionalInitialSkills: parseCSV(normalizeText(formData.get("professionalInitialSkills"))),
    techSkills: parseCSV(normalizeText(formData.get("techSkills"))),
    techInitialSkills: parseCSV(normalizeText(formData.get("techInitialSkills"))),
    professionalImageUrl: normalizeText(formData.get("professionalImageUrl")),
    techImageUrl: normalizeText(formData.get("techImageUrl")),
    exploreProfessionalLabel: normalizeText(formData.get("exploreProfessionalLabel")),
    exploreTechLabel: normalizeText(formData.get("exploreTechLabel")),
    resetViewLabel: normalizeText(formData.get("resetViewLabel")),
    downloadResumeLabel: normalizeText(formData.get("downloadResumeLabel")),
    getInTouchLabel: normalizeText(formData.get("getInTouchLabel")),
    viewProjectsLabel: normalizeText(formData.get("viewProjectsLabel")),
    viewArticlesLabel: normalizeText(formData.get("viewArticlesLabel")),
    homeWorkSectionTitle: normalizeText(formData.get("homeWorkSectionTitle")),
    homeFeaturedArticlesTitle: normalizeText(formData.get("homeFeaturedArticlesTitle")),
    homeFeaturedProjectsTitle: normalizeText(formData.get("homeFeaturedProjectsTitle")),
    homeViewAllArticlesLabel: normalizeText(formData.get("homeViewAllArticlesLabel")),
    homeViewAllProjectsLabel: normalizeText(formData.get("homeViewAllProjectsLabel")),
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabase.from("HeroContent").update(payload).eq("id", "default");
  if (error) {
    redirect("/admin/settings?error=hero_content_update_failed");
  }

  revalidateAllPublic();
  redirect("/admin/settings?success=hero_content_updated");
}

async function updatePageContent(formData: FormData) {
  "use server";

  await assertAdmin();
  const supabase = createSupabaseSecretClient();

  const page = normalizeText(formData.get("page"));
  if (!page) {
    redirect("/admin/settings?error=invalid_page_content");
  }

  const rawContent = normalizeText(formData.get("contentJson"));
  let parsedContent: Record<string, unknown> | null = null;

  if (rawContent) {
    try {
      const value = JSON.parse(rawContent);
      parsedContent = typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
    } catch {
      redirect("/admin/settings?error=invalid_page_content_json");
    }
  }

  const payload = {
    title: normalizeText(formData.get("title")),
    subtitle: normalizeText(formData.get("subtitle")),
    emptyTitle: normalizeText(formData.get("emptyTitle")) || null,
    emptyMessage: normalizeText(formData.get("emptyMessage")) || null,
    primaryCta: normalizeText(formData.get("primaryCta")) || null,
    secondaryCta: normalizeText(formData.get("secondaryCta")) || null,
    content: parsedContent,
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabase.from("PageContent").update(payload).eq("page", page);
  if (error) {
    redirect("/admin/settings?error=page_content_update_failed");
  }

  revalidateAllPublic();
  redirect("/admin/settings?success=page_content_updated");
}

async function createSocialLink(formData: FormData) {
  "use server";

  await assertAdmin();
  const supabase = createSupabaseSecretClient();
  const id = normalizeText(formData.get("id"));

  const payload = {
    id,
    platform: normalizeText(formData.get("platform")),
    label: normalizeText(formData.get("label")),
    url: normalizeText(formData.get("url")),
    position: normalizeText(formData.get("position")) || "FOOTER",
    order: Number(formData.get("order") ?? 0) || 0,
    visible: formData.get("visible") === "on",
    updatedAt: new Date().toISOString(),
  };

  if (!id || !payload.platform || !payload.label || !payload.url) {
    redirect("/admin/settings?error=invalid_social_link");
  }

  const { error } = await supabase.from("SocialLink").insert(payload);
  if (error) {
    redirect("/admin/settings?error=social_link_create_failed");
  }

  revalidateAllPublic();
  redirect("/admin/settings?success=social_link_created");
}

async function updateSocialLink(formData: FormData) {
  "use server";

  await assertAdmin();
  const supabase = createSupabaseSecretClient();
  const id = normalizeText(formData.get("id"));

  const payload = {
    platform: normalizeText(formData.get("platform")),
    label: normalizeText(formData.get("label")),
    url: normalizeText(formData.get("url")),
    position: normalizeText(formData.get("position")) || "FOOTER",
    order: Number(formData.get("order") ?? 0) || 0,
    visible: formData.get("visible") === "on",
    updatedAt: new Date().toISOString(),
  };

  if (!id) {
    redirect("/admin/settings?error=invalid_social_link");
  }

  const { error } = await supabase.from("SocialLink").update(payload).eq("id", id);
  if (error) {
    redirect("/admin/settings?error=social_link_update_failed");
  }

  revalidateAllPublic();
  redirect("/admin/settings?success=social_link_updated");
}

async function deleteSocialLink(formData: FormData) {
  "use server";

  await assertAdmin();
  const supabase = createSupabaseSecretClient();
  const id = normalizeText(formData.get("id"));

  if (!id) {
    redirect("/admin/settings?error=invalid_social_link");
  }

  const { error } = await supabase.from("SocialLink").delete().eq("id", id);
  if (error) {
    redirect("/admin/settings?error=social_link_delete_failed");
  }

  revalidateAllPublic();
  redirect("/admin/settings?success=social_link_deleted");
}

export default async function SettingsPage() {
  const supabase = createSupabaseSecretClient();

  const [siteConfigResult, heroResult, pagesResult, socialResult] = await Promise.all([
    supabase.from("SiteConfig").select("*").eq("id", "default").maybeSingle(),
    supabase.from("HeroContent").select("*").eq("id", "default").maybeSingle(),
    supabase
      .from("PageContent")
      .select("id,page,title,subtitle,emptyTitle,emptyMessage,primaryCta,secondaryCta,content,createdAt,updatedAt"),
    supabase
      .from("SocialLink")
      .select("id,platform,label,url,position,order,visible,createdAt,updatedAt")
      .order("position", { ascending: true })
      .order("order", { ascending: true }),
  ]);

  if (siteConfigResult.error) throw siteConfigResult.error;
  if (heroResult.error) throw heroResult.error;
  if (pagesResult.error) throw pagesResult.error;
  if (socialResult.error) throw socialResult.error;

  const siteConfig = siteConfigResult.data as SiteConfig | null;
  const hero = heroResult.data as HeroContent | null;
  const pages = sortPages((pagesResult.data ?? []) as PageContent[]);
  const socialLinks = (socialResult.data ?? []) as SocialLink[];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Settings"
        description="Manage the site shell, hero content, public page content, and social links from one place."
      />

      <SettingsSection
        title="Site Config"
        description="Core site shell values that feed the public header, footer, metadata, and downloads."
        action={<span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Single source of truth</span>}
      >
        <form action={updateSiteConfig} className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <Input name="siteName" placeholder="Site Name" defaultValue={siteConfig?.siteName ?? ""} required />
            <Input name="siteTagline" placeholder="Tagline" defaultValue={siteConfig?.siteTagline ?? ""} required />
            <Input name="logoAlt" placeholder="Logo alt text" defaultValue={siteConfig?.logoAlt ?? ""} required />
            <Input name="primaryEmail" placeholder="Primary email" defaultValue={siteConfig?.primaryEmail ?? ""} required />
            <Input name="locationLabel" placeholder="Location label" defaultValue={siteConfig?.locationLabel ?? ""} required />
            <Input name="defaultTitle" placeholder="Default meta title" defaultValue={siteConfig?.defaultTitle ?? ""} required />
            <Input
              name="defaultDescription"
              placeholder="Default meta description"
              defaultValue={siteConfig?.defaultDescription ?? ""}
              required
              className="lg:col-span-2"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <FileUploadField
              name="logoUrl"
              label="Logo asset"
              description="Upload a logo or paste a URL. This feeds the public header."
              value={siteConfig?.logoUrl ?? ""}
              folder="site-config/logo"
              accept="image/*,.svg"
              required
            />
            <FileUploadField
              name="resumeUrl"
              label="Resume file"
              description="Upload the downloadable resume file used by the public hero."
              value={siteConfig?.resumeUrl ?? ""}
              folder="site-config/resume"
              accept=".pdf,application/pdf"
              required
            />
          </div>

          <Button type="submit" className="w-fit">
            Save Site Config
          </Button>
        </form>
      </SettingsSection>

      <HeroContentMatrix hero={hero} action={updateHeroContent} />

      <PublicPageContentList pages={pages} action={updatePageContent} />

      <SocialSettingsTable
        socialLinks={socialLinks}
        createAction={createSocialLink}
        updateAction={updateSocialLink}
        deleteAction={deleteSocialLink}
      />
    </div>
  );
}
