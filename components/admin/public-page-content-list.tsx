import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SettingsSection } from "@/components/admin/settings-section";
import type { PageContent, PublicPage } from "@/lib/db-types";

const PAGE_ORDER: PublicPage[] = ["HOME", "PROFILE", "ARTICLES", "PROJECTS", "CONTACT"];
const PAGE_LABELS: Record<PublicPage, string> = {
  HOME: "Home",
  PROFILE: "Profile",
  ARTICLES: "Blogs",
  PROJECTS: "Projects",
  CONTACT: "Contact",
};

const orderedPages = (pages: PageContent[]) =>
  [...pages].sort((left, right) => PAGE_ORDER.indexOf(left.page) - PAGE_ORDER.indexOf(right.page));

const summaryKeys = (content: Record<string, unknown> | null) =>
  Object.keys(content ?? {}).filter((key) => content?.[key] !== null && content?.[key] !== undefined);

export function PublicPageContentList({
  pages,
  action,
}: {
  pages: PageContent[];
  action: (formData: FormData) => Promise<void>;
}) {
  const normalizedPages = orderedPages(pages);

  return (
    <SettingsSection
      title="Public Page Content"
      description="Use the table to jump between pages, then edit each page block directly below."
      action={<Badge variant="outline">{normalizedPages.length} pages</Badge>}
    >
      <div className="space-y-6">
        <div className="overflow-x-auto rounded-2xl border border-border/70">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted/45 text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Page</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Subtitle</th>
                <th className="px-4 py-3">Content</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Jump</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {normalizedPages.map((page) => (
                <tr key={page.id} className="bg-background/70">
                  <td className="px-4 py-3 font-medium">{PAGE_LABELS[page.page]}</td>
                  <td className="px-4 py-3 text-muted-foreground">{page.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{page.subtitle}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {summaryKeys(page.content as Record<string, unknown> | null).slice(0, 4).map((key) => (
                        <Badge key={key} variant="secondary" className="px-2 py-1">
                          {key}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(page.updatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`#page-${page.page}`}>Edit</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4">
          {normalizedPages.map((page) => (
            <form key={page.id} id={`page-${page.page}`} action={action} className="rounded-2xl border border-border/70 bg-muted/15 p-4 md:p-5">
              <input type="hidden" name="page" value={page.page} />
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{PAGE_LABELS[page.page]}</Badge>
                    <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{page.page}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{page.title}</h3>
                  <p className="text-sm text-muted-foreground">{page.subtitle}</p>
                </div>
                <Button type="submit" size="sm" variant="outline">
                  Save {PAGE_LABELS[page.page]}
                </Button>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium">Title</span>
                  <Input name="title" defaultValue={page.title} required />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Subtitle</span>
                  <Input name="subtitle" defaultValue={page.subtitle} required />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Empty title</span>
                  <Input name="emptyTitle" defaultValue={page.emptyTitle ?? ""} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Empty message</span>
                  <Input name="emptyMessage" defaultValue={page.emptyMessage ?? ""} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Primary CTA</span>
                  <Input name="primaryCta" defaultValue={page.primaryCta ?? ""} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Secondary CTA</span>
                  <Input name="secondaryCta" defaultValue={page.secondaryCta ?? ""} />
                </label>
              </div>

              <label className="mt-4 block space-y-2">
                <span className="text-sm font-medium">Content JSON</span>
                <Textarea
                  name="contentJson"
                  className="min-h-[12rem]"
                  defaultValue={JSON.stringify(page.content ?? {}, null, 2)}
                  placeholder='{"summary":"..."}'
                />
              </label>
            </form>
          ))}
        </div>
      </div>
    </SettingsSection>
  );
}
