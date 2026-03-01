import { createSupabaseSecretClient } from "@/lib/supabase-secret";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = createSupabaseSecretClient();

  const [siteConfigResult, heroResult, pagesResult, navResult, socialResult, competencyResult] = await Promise.all([
    supabase.from("SiteConfig").select("*").eq("id", "default").maybeSingle(),
    supabase.from("HeroContent").select("*").eq("id", "default").maybeSingle(),
    supabase.from("PageContent").select("page,title,subtitle,updatedAt").order("page", { ascending: true }),
    supabase.from("NavigationItem").select("id,label,href,position,order,visible").order("position", { ascending: true }).order("order", { ascending: true }),
    supabase.from("SocialLink").select("id,label,url,platform,position,order,visible").order("position", { ascending: true }).order("order", { ascending: true }),
    supabase.from("Competency").select("id,name,category,order,visible").order("category", { ascending: true }).order("order", { ascending: true }),
  ]);

  if (siteConfigResult.error) throw siteConfigResult.error;
  if (heroResult.error) throw heroResult.error;
  if (pagesResult.error) throw pagesResult.error;
  if (navResult.error) throw navResult.error;
  if (socialResult.error) throw socialResult.error;
  if (competencyResult.error) throw competencyResult.error;

  const siteConfig = siteConfigResult.data;
  const hero = heroResult.data;
  const pages = pagesResult.data ?? [];
  const navItems = navResult.data ?? [];
  const socialLinks = socialResult.data ?? [];
  const competencies = competencyResult.data ?? [];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Site Config</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Site Name: {siteConfig?.siteName}</p>
          <p>Tagline: {siteConfig?.siteTagline}</p>
          <p>Resume URL: {siteConfig?.resumeUrl}</p>
          <p>Primary Email: {siteConfig?.primaryEmail}</p>
          <p>Location: {siteConfig?.locationLabel}</p>
          <p>Default Title: {siteConfig?.defaultTitle}</p>
          <p>Default Description: {siteConfig?.defaultDescription}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Name: {hero?.displayName}</p>
          <p>Professional Title: {hero?.professionalTitle}</p>
          <p>Tech Title: {hero?.techTitle}</p>
          <p>Explore Professional CTA: {hero?.exploreProfessionalLabel}</p>
          <p>Explore Tech CTA: {hero?.exploreTechLabel}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Public Page Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {pages.map((page) => (
            <div key={page.page} className="border-b pb-2 last:border-b-0">
              <p className="font-medium">{page.page}</p>
              <p>Title: {page.title}</p>
              <p>Subtitle: {page.subtitle}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navigation Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {navItems.map((item) => (
            <p key={item.id}>
              [{item.position}] #{item.order} {item.label}
              {" -> "}
              {item.href} ({item.visible ? "visible" : "hidden"})
            </p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {socialLinks.map((item) => (
            <p key={item.id}>
              [{item.position}] #{item.order} {item.label} ({item.platform})
              {" -> "}
              {item.url}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Competencies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {competencies.map((item) => (
            <p key={item.id}>
              [{item.category}] #{item.order} {item.name} ({item.visible ? "visible" : "hidden"})
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
