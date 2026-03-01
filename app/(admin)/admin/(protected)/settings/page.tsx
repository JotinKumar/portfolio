import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseSecretClient } from "@/lib/supabase-secret";
import { getUser } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Competency, HeroContent, NavigationItem, PageContent, SiteConfig, SocialLink } from "@/lib/db-types";

export const dynamic = "force-dynamic";

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
  revalidatePath("/articles");
  revalidatePath("/projects");
  revalidatePath("/contact");
}

function parseCSV(input: string): string[] {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function updateSiteConfig(formData: FormData) {
  "use server";

  await assertAdmin();
  const supabase = createSupabaseSecretClient();

  const payload = {
    siteName: String(formData.get("siteName") ?? "").trim(),
    siteTagline: String(formData.get("siteTagline") ?? "").trim(),
    logoUrl: String(formData.get("logoUrl") ?? "").trim(),
    logoAlt: String(formData.get("logoAlt") ?? "").trim(),
    resumeUrl: String(formData.get("resumeUrl") ?? "").trim(),
    primaryEmail: String(formData.get("primaryEmail") ?? "").trim(),
    locationLabel: String(formData.get("locationLabel") ?? "").trim(),
    defaultTitle: String(formData.get("defaultTitle") ?? "").trim(),
    defaultDescription: String(formData.get("defaultDescription") ?? "").trim(),
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
    displayName: String(formData.get("displayName") ?? "").trim(),
    professionalTitle: String(formData.get("professionalTitle") ?? "").trim(),
    professionalSubtitle: String(formData.get("professionalSubtitle") ?? "").trim(),
    techTitle: String(formData.get("techTitle") ?? "").trim(),
    techSubtitle: String(formData.get("techSubtitle") ?? "").trim(),
    professionalSkills: parseCSV(String(formData.get("professionalSkills") ?? "")),
    professionalInitialSkills: parseCSV(String(formData.get("professionalInitialSkills") ?? "")),
    techSkills: parseCSV(String(formData.get("techSkills") ?? "")),
    techInitialSkills: parseCSV(String(formData.get("techInitialSkills") ?? "")),
    professionalImageUrl: String(formData.get("professionalImageUrl") ?? "").trim(),
    techImageUrl: String(formData.get("techImageUrl") ?? "").trim(),
    exploreProfessionalLabel: String(formData.get("exploreProfessionalLabel") ?? "").trim(),
    exploreTechLabel: String(formData.get("exploreTechLabel") ?? "").trim(),
    resetViewLabel: String(formData.get("resetViewLabel") ?? "").trim(),
    downloadResumeLabel: String(formData.get("downloadResumeLabel") ?? "").trim(),
    getInTouchLabel: String(formData.get("getInTouchLabel") ?? "").trim(),
    viewProjectsLabel: String(formData.get("viewProjectsLabel") ?? "").trim(),
    viewArticlesLabel: String(formData.get("viewArticlesLabel") ?? "").trim(),
    homeWorkSectionTitle: String(formData.get("homeWorkSectionTitle") ?? "").trim(),
    homeFeaturedArticlesTitle: String(formData.get("homeFeaturedArticlesTitle") ?? "").trim(),
    homeFeaturedProjectsTitle: String(formData.get("homeFeaturedProjectsTitle") ?? "").trim(),
    homeViewAllArticlesLabel: String(formData.get("homeViewAllArticlesLabel") ?? "").trim(),
    homeViewAllProjectsLabel: String(formData.get("homeViewAllProjectsLabel") ?? "").trim(),
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

  const page = String(formData.get("page") ?? "").trim();
  if (!page) {
    redirect("/admin/settings?error=invalid_page_content");
  }

  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    emptyTitle: String(formData.get("emptyTitle") ?? "").trim() || null,
    emptyMessage: String(formData.get("emptyMessage") ?? "").trim() || null,
    primaryCta: String(formData.get("primaryCta") ?? "").trim() || null,
    secondaryCta: String(formData.get("secondaryCta") ?? "").trim() || null,
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabase.from("PageContent").update(payload).eq("page", page);
  if (error) {
    redirect("/admin/settings?error=page_content_update_failed");
  }

  revalidateAllPublic();
  redirect("/admin/settings?success=page_content_updated");
}

async function createNavigationItem(formData: FormData) {
  "use server";

  await assertAdmin();
  const supabase = createSupabaseSecretClient();
  const id = String(formData.get("id") ?? "").trim();

  const payload = {
    id,
    label: String(formData.get("label") ?? "").trim(),
    href: String(formData.get("href") ?? "").trim(),
    position: String(formData.get("position") ?? "HEADER").trim(),
    order: Number(formData.get("order") ?? 0) || 0,
    visible: formData.get("visible") === "on",
    isExternal: formData.get("isExternal") === "on",
    openInNewTab: formData.get("openInNewTab") === "on",
    updatedAt: new Date().toISOString(),
  };

  if (!id || !payload.label || !payload.href) {
    redirect("/admin/settings?error=invalid_navigation_item");
  }

  const { error } = await supabase.from("NavigationItem").insert(payload);
  if (error) {
    redirect("/admin/settings?error=navigation_item_create_failed");
  }

  revalidateAllPublic();
  redirect("/admin/settings?success=navigation_item_created");
}

async function updateNavigationItem(formData: FormData) {
  "use server";

  await assertAdmin();
  const supabase = createSupabaseSecretClient();
  const id = String(formData.get("id") ?? "").trim();

  const payload = {
    label: String(formData.get("label") ?? "").trim(),
    href: String(formData.get("href") ?? "").trim(),
    position: String(formData.get("position") ?? "HEADER").trim(),
    order: Number(formData.get("order") ?? 0) || 0,
    visible: formData.get("visible") === "on",
    isExternal: formData.get("isExternal") === "on",
    openInNewTab: formData.get("openInNewTab") === "on",
    updatedAt: new Date().toISOString(),
  };

  if (!id) {
    redirect("/admin/settings?error=invalid_navigation_item");
  }

  const { error } = await supabase.from("NavigationItem").update(payload).eq("id", id);
  if (error) {
    redirect("/admin/settings?error=navigation_item_update_failed");
  }

  revalidateAllPublic();
  redirect("/admin/settings?success=navigation_item_updated");
}

async function deleteNavigationItem(formData: FormData) {
  "use server";

  await assertAdmin();
  const supabase = createSupabaseSecretClient();
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirect("/admin/settings?error=invalid_navigation_item");
  }

  const { error } = await supabase.from("NavigationItem").delete().eq("id", id);
  if (error) {
    redirect("/admin/settings?error=navigation_item_delete_failed");
  }

  revalidateAllPublic();
  redirect("/admin/settings?success=navigation_item_deleted");
}

async function createSocialLink(formData: FormData) {
  "use server";

  await assertAdmin();
  const supabase = createSupabaseSecretClient();
  const id = String(formData.get("id") ?? "").trim();

  const payload = {
    id,
    platform: String(formData.get("platform") ?? "").trim(),
    label: String(formData.get("label") ?? "").trim(),
    url: String(formData.get("url") ?? "").trim(),
    position: String(formData.get("position") ?? "FOOTER").trim(),
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
  const id = String(formData.get("id") ?? "").trim();

  const payload = {
    platform: String(formData.get("platform") ?? "").trim(),
    label: String(formData.get("label") ?? "").trim(),
    url: String(formData.get("url") ?? "").trim(),
    position: String(formData.get("position") ?? "FOOTER").trim(),
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
  const id = String(formData.get("id") ?? "").trim();

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

async function createCompetency(formData: FormData) {
  "use server";

  await assertAdmin();
  const supabase = createSupabaseSecretClient();
  const id = String(formData.get("id") ?? "").trim();

  const payload = {
    id,
    name: String(formData.get("name") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    order: Number(formData.get("order") ?? 0) || 0,
    visible: formData.get("visible") === "on",
    updatedAt: new Date().toISOString(),
  };

  if (!id || !payload.name || !payload.category) {
    redirect("/admin/settings?error=invalid_competency");
  }

  const { error } = await supabase.from("Competency").insert(payload);
  if (error) {
    redirect("/admin/settings?error=competency_create_failed");
  }

  revalidateAllPublic();
  redirect("/admin/settings?success=competency_created");
}

async function updateCompetency(formData: FormData) {
  "use server";

  await assertAdmin();
  const supabase = createSupabaseSecretClient();
  const id = String(formData.get("id") ?? "").trim();

  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    order: Number(formData.get("order") ?? 0) || 0,
    visible: formData.get("visible") === "on",
    updatedAt: new Date().toISOString(),
  };

  if (!id) {
    redirect("/admin/settings?error=invalid_competency");
  }

  const { error } = await supabase.from("Competency").update(payload).eq("id", id);
  if (error) {
    redirect("/admin/settings?error=competency_update_failed");
  }

  revalidateAllPublic();
  redirect("/admin/settings?success=competency_updated");
}

async function deleteCompetency(formData: FormData) {
  "use server";

  await assertAdmin();
  const supabase = createSupabaseSecretClient();
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirect("/admin/settings?error=invalid_competency");
  }

  const { error } = await supabase.from("Competency").delete().eq("id", id);
  if (error) {
    redirect("/admin/settings?error=competency_delete_failed");
  }

  revalidateAllPublic();
  redirect("/admin/settings?success=competency_deleted");
}

export default async function SettingsPage() {
  const supabase = createSupabaseSecretClient();

  const [siteConfigResult, heroResult, pagesResult, navResult, socialResult, competencyResult] = await Promise.all([
    supabase.from("SiteConfig").select("*").eq("id", "default").maybeSingle(),
    supabase.from("HeroContent").select("*").eq("id", "default").maybeSingle(),
    supabase
      .from("PageContent")
      .select("id,page,title,subtitle,emptyTitle,emptyMessage,primaryCta,secondaryCta,content,createdAt,updatedAt")
      .order("page", { ascending: true }),
    supabase
      .from("NavigationItem")
      .select("id,label,href,order,position,visible,isExternal,openInNewTab,createdAt,updatedAt")
      .order("position", { ascending: true })
      .order("order", { ascending: true }),
    supabase
      .from("SocialLink")
      .select("id,platform,label,url,position,order,visible,createdAt,updatedAt")
      .order("position", { ascending: true })
      .order("order", { ascending: true }),
    supabase
      .from("Competency")
      .select("id,name,category,order,visible,createdAt,updatedAt")
      .order("category", { ascending: true })
      .order("order", { ascending: true }),
  ]);

  if (siteConfigResult.error) throw siteConfigResult.error;
  if (heroResult.error) throw heroResult.error;
  if (pagesResult.error) throw pagesResult.error;
  if (navResult.error) throw navResult.error;
  if (socialResult.error) throw socialResult.error;
  if (competencyResult.error) throw competencyResult.error;

  const siteConfig = siteConfigResult.data as SiteConfig | null;
  const hero = heroResult.data as HeroContent | null;
  const pages = (pagesResult.data ?? []) as PageContent[];
  const navigationItems = (navResult.data ?? []) as NavigationItem[];
  const socialLinks = (socialResult.data ?? []) as SocialLink[];
  const competencies = (competencyResult.data ?? []) as Competency[];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Site Config</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateSiteConfig} className="grid gap-3">
            <Input name="siteName" placeholder="Site Name" defaultValue={siteConfig?.siteName ?? ""} required />
            <Input name="siteTagline" placeholder="Tagline" defaultValue={siteConfig?.siteTagline ?? ""} required />
            <Input name="logoUrl" placeholder="Logo URL" defaultValue={siteConfig?.logoUrl ?? ""} required />
            <Input name="logoAlt" placeholder="Logo alt text" defaultValue={siteConfig?.logoAlt ?? ""} required />
            <Input name="resumeUrl" placeholder="Resume URL" defaultValue={siteConfig?.resumeUrl ?? ""} required />
            <Input name="primaryEmail" placeholder="Primary email" defaultValue={siteConfig?.primaryEmail ?? ""} required />
            <Input name="locationLabel" placeholder="Location label" defaultValue={siteConfig?.locationLabel ?? ""} required />
            <Input name="defaultTitle" placeholder="Default meta title" defaultValue={siteConfig?.defaultTitle ?? ""} required />
            <Input
              name="defaultDescription"
              placeholder="Default meta description"
              defaultValue={siteConfig?.defaultDescription ?? ""}
              required
            />
            <Button type="submit" className="w-fit">
              Save Site Config
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero Content</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateHeroContent} className="grid gap-3">
            <Input name="displayName" placeholder="Display name" defaultValue={hero?.displayName ?? ""} required />
            <Input
              name="professionalTitle"
              placeholder="Professional title"
              defaultValue={hero?.professionalTitle ?? ""}
              required
            />
            <Input
              name="professionalSubtitle"
              placeholder="Professional subtitle"
              defaultValue={hero?.professionalSubtitle ?? ""}
              required
            />
            <Input name="techTitle" placeholder="Tech title" defaultValue={hero?.techTitle ?? ""} required />
            <Input name="techSubtitle" placeholder="Tech subtitle" defaultValue={hero?.techSubtitle ?? ""} required />
            <Input
              name="professionalSkills"
              placeholder="Professional skills (comma separated)"
              defaultValue={(hero?.professionalSkills ?? []).join(", ")}
              required
            />
            <Input
              name="professionalInitialSkills"
              placeholder="Professional initial skills (comma separated)"
              defaultValue={(hero?.professionalInitialSkills ?? []).join(", ")}
              required
            />
            <Input
              name="techSkills"
              placeholder="Tech skills (comma separated)"
              defaultValue={(hero?.techSkills ?? []).join(", ")}
              required
            />
            <Input
              name="techInitialSkills"
              placeholder="Tech initial skills (comma separated)"
              defaultValue={(hero?.techInitialSkills ?? []).join(", ")}
              required
            />
            <Input
              name="professionalImageUrl"
              placeholder="Professional image URL"
              defaultValue={hero?.professionalImageUrl ?? ""}
              required
            />
            <Input name="techImageUrl" placeholder="Tech image URL" defaultValue={hero?.techImageUrl ?? ""} required />
            <Input
              name="exploreProfessionalLabel"
              placeholder="Explore Professional label"
              defaultValue={hero?.exploreProfessionalLabel ?? ""}
              required
            />
            <Input
              name="exploreTechLabel"
              placeholder="Explore Tech label"
              defaultValue={hero?.exploreTechLabel ?? ""}
              required
            />
            <Input name="resetViewLabel" placeholder="Reset label" defaultValue={hero?.resetViewLabel ?? ""} required />
            <Input
              name="downloadResumeLabel"
              placeholder="Download resume label"
              defaultValue={hero?.downloadResumeLabel ?? ""}
              required
            />
            <Input name="getInTouchLabel" placeholder="Get in touch label" defaultValue={hero?.getInTouchLabel ?? ""} required />
            <Input
              name="viewProjectsLabel"
              placeholder="View projects label"
              defaultValue={hero?.viewProjectsLabel ?? ""}
              required
            />
            <Input
              name="viewArticlesLabel"
              placeholder="View articles label"
              defaultValue={hero?.viewArticlesLabel ?? ""}
              required
            />
            <Input
              name="homeWorkSectionTitle"
              placeholder="Home work section title"
              defaultValue={hero?.homeWorkSectionTitle ?? ""}
              required
            />
            <Input
              name="homeFeaturedArticlesTitle"
              placeholder="Home featured articles title"
              defaultValue={hero?.homeFeaturedArticlesTitle ?? ""}
              required
            />
            <Input
              name="homeFeaturedProjectsTitle"
              placeholder="Home featured projects title"
              defaultValue={hero?.homeFeaturedProjectsTitle ?? ""}
              required
            />
            <Input
              name="homeViewAllArticlesLabel"
              placeholder="Home view all articles label"
              defaultValue={hero?.homeViewAllArticlesLabel ?? ""}
              required
            />
            <Input
              name="homeViewAllProjectsLabel"
              placeholder="Home view all projects label"
              defaultValue={hero?.homeViewAllProjectsLabel ?? ""}
              required
            />
            <Button type="submit" className="w-fit">
              Save Hero Content
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Public Page Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {pages.map((page) => (
            <form key={page.id} action={updatePageContent} className="grid gap-3 border rounded-lg p-4">
              <input type="hidden" name="page" value={page.page} />
              <p className="font-semibold">{page.page}</p>
              <Input name="title" placeholder="Title" defaultValue={page.title} required />
              <Input name="subtitle" placeholder="Subtitle" defaultValue={page.subtitle} required />
              <Input name="emptyTitle" placeholder="Empty title" defaultValue={page.emptyTitle ?? ""} />
              <Input name="emptyMessage" placeholder="Empty message" defaultValue={page.emptyMessage ?? ""} />
              <Input name="primaryCta" placeholder="Primary CTA" defaultValue={page.primaryCta ?? ""} />
              <Input name="secondaryCta" placeholder="Secondary CTA" defaultValue={page.secondaryCta ?? ""} />
              <Button type="submit" className="w-fit">
                Save {page.page}
              </Button>
            </form>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navigation Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={createNavigationItem} className="grid gap-3 border rounded-lg p-4">
            <p className="font-semibold">Create Navigation Item</p>
            <Input name="id" placeholder="Unique ID (example: HEADER-99)" required />
            <Input name="label" placeholder="Label" required />
            <Input name="href" placeholder="Href" required />
            <select name="position" defaultValue="HEADER" className="h-10 rounded-md border bg-background px-3 text-sm">
              <option value="HEADER">HEADER</option>
              <option value="FOOTER_QUICK">FOOTER_QUICK</option>
              <option value="FOOTER_RESOURCE">FOOTER_RESOURCE</option>
              <option value="FOOTER_LEGAL">FOOTER_LEGAL</option>
            </select>
            <Input name="order" type="number" defaultValue={0} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="visible" defaultChecked /> Visible
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isExternal" /> External link
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="openInNewTab" /> Open in new tab
            </label>
            <Button type="submit" className="w-fit">Create Navigation Item</Button>
          </form>

          {navigationItems.map((item) => (
            <form key={item.id} action={updateNavigationItem} className="grid gap-3 border rounded-lg p-4">
              <input type="hidden" name="id" value={item.id} />
              <p className="font-semibold">{item.id}</p>
              <Input name="label" defaultValue={item.label} required />
              <Input name="href" defaultValue={item.href} required />
              <select
                name="position"
                defaultValue={item.position}
                className="h-10 rounded-md border bg-background px-3 text-sm"
              >
                <option value="HEADER">HEADER</option>
                <option value="FOOTER_QUICK">FOOTER_QUICK</option>
                <option value="FOOTER_RESOURCE">FOOTER_RESOURCE</option>
                <option value="FOOTER_LEGAL">FOOTER_LEGAL</option>
              </select>
              <Input name="order" type="number" defaultValue={item.order} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="visible" defaultChecked={item.visible} /> Visible
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isExternal" defaultChecked={item.isExternal} /> External link
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="openInNewTab" defaultChecked={item.openInNewTab} /> Open in new tab
              </label>
              <div className="flex gap-2">
                <Button type="submit" className="w-fit">Save</Button>
                <Button formAction={deleteNavigationItem} type="submit" variant="destructive" className="w-fit">
                  Delete
                </Button>
              </div>
            </form>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={createSocialLink} className="grid gap-3 border rounded-lg p-4">
            <p className="font-semibold">Create Social Link</p>
            <Input name="id" placeholder="Unique ID (example: social-youtube)" required />
            <Input name="platform" placeholder="Platform" required />
            <Input name="label" placeholder="Label" required />
            <Input name="url" placeholder="URL" required />
            <select name="position" defaultValue="FOOTER" className="h-10 rounded-md border bg-background px-3 text-sm">
              <option value="FOOTER">FOOTER</option>
              <option value="CONTACT">CONTACT</option>
            </select>
            <Input name="order" type="number" defaultValue={0} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="visible" defaultChecked /> Visible
            </label>
            <Button type="submit" className="w-fit">Create Social Link</Button>
          </form>

          {socialLinks.map((item) => (
            <form key={item.id} action={updateSocialLink} className="grid gap-3 border rounded-lg p-4">
              <input type="hidden" name="id" value={item.id} />
              <p className="font-semibold">{item.id}</p>
              <Input name="platform" defaultValue={item.platform} required />
              <Input name="label" defaultValue={item.label} required />
              <Input name="url" defaultValue={item.url} required />
              <select
                name="position"
                defaultValue={item.position}
                className="h-10 rounded-md border bg-background px-3 text-sm"
              >
                <option value="FOOTER">FOOTER</option>
                <option value="CONTACT">CONTACT</option>
              </select>
              <Input name="order" type="number" defaultValue={item.order} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="visible" defaultChecked={item.visible} /> Visible
              </label>
              <div className="flex gap-2">
                <Button type="submit" className="w-fit">Save</Button>
                <Button formAction={deleteSocialLink} type="submit" variant="destructive" className="w-fit">
                  Delete
                </Button>
              </div>
            </form>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Competencies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={createCompetency} className="grid gap-3 border rounded-lg p-4">
            <p className="font-semibold">Create Competency</p>
            <Input name="id" placeholder="Unique ID (example: COMMERCIAL_DELIVERY-99)" required />
            <Input name="name" placeholder="Competency name" required />
            <Input name="category" placeholder="Category" required />
            <Input name="order" type="number" defaultValue={0} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="visible" defaultChecked /> Visible
            </label>
            <Button type="submit" className="w-fit">Create Competency</Button>
          </form>

          {competencies.map((item) => (
            <form key={item.id} action={updateCompetency} className="grid gap-3 border rounded-lg p-4">
              <input type="hidden" name="id" value={item.id} />
              <p className="font-semibold">{item.id}</p>
              <Input name="name" defaultValue={item.name} required />
              <Input name="category" defaultValue={item.category} required />
              <Input name="order" type="number" defaultValue={item.order} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="visible" defaultChecked={item.visible} /> Visible
              </label>
              <div className="flex gap-2">
                <Button type="submit" className="w-fit">Save</Button>
                <Button formAction={deleteCompetency} type="submit" variant="destructive" className="w-fit">
                  Delete
                </Button>
              </div>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
