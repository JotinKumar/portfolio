import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadField } from "@/components/admin/file-upload-field";
import { SettingsSection } from "@/components/admin/settings-section";
import type { HeroContent } from "@/lib/db-types";

function csv(value: string[] | undefined) {
  return (value ?? []).join(", ");
}

export function HeroContentMatrix({
  hero,
  action,
}: {
  hero: HeroContent | null;
  action: (formData: FormData) => Promise<void>;
}) {
  const rows = [
    {
      label: "Title",
      professional: <Input name="professionalTitle" defaultValue={hero?.professionalTitle ?? ""} required />,
      tech: <Input name="techTitle" defaultValue={hero?.techTitle ?? ""} required />,
    },
    {
      label: "Subtitle",
      professional: (
        <Textarea
          name="professionalSubtitle"
          defaultValue={hero?.professionalSubtitle ?? ""}
          className="min-h-28"
          required
        />
      ),
      tech: <Textarea name="techSubtitle" defaultValue={hero?.techSubtitle ?? ""} className="min-h-28" required />,
    },
    {
      label: "Skills",
      professional: (
        <Textarea
          name="professionalSkills"
          defaultValue={csv(hero?.professionalSkills)}
          className="min-h-28"
          placeholder="Comma-separated skills"
          required
        />
      ),
      tech: (
        <Textarea
          name="techSkills"
          defaultValue={csv(hero?.techSkills)}
          className="min-h-28"
          placeholder="Comma-separated skills"
          required
        />
      ),
    },
    {
      label: "Starter skills",
      professional: (
        <Textarea
          name="professionalInitialSkills"
          defaultValue={csv(hero?.professionalInitialSkills)}
          className="min-h-28"
          placeholder="Skills shown initially"
          required
        />
      ),
      tech: (
        <Textarea
          name="techInitialSkills"
          defaultValue={csv(hero?.techInitialSkills)}
          className="min-h-28"
          placeholder="Skills shown initially"
          required
        />
      ),
    },
    {
      label: "Hero image",
      professional: (
        <FileUploadField
          name="professionalImageUrl"
          label="Professional portrait"
          value={hero?.professionalImageUrl ?? ""}
          folder="hero/professional"
          accept="image/*"
          required
        />
      ),
      tech: (
        <FileUploadField
          name="techImageUrl"
          label="Tech portrait"
          value={hero?.techImageUrl ?? ""}
          folder="hero/tech"
          accept="image/*"
          required
        />
      ),
    },
  ];

  return (
    <SettingsSection
      title="Hero Content"
      description="Edit the professional and tech hero variants side by side. The matrix keeps the paired content aligned."
      action={<Badge variant="outline">Editable matrix</Badge>}
    >
      <form action={action} className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <label className="space-y-2">
            <span className="text-sm font-medium">Display name</span>
            <Input name="displayName" defaultValue={hero?.displayName ?? ""} required />
          </label>
          <div className="rounded-2xl border border-border/60 bg-muted/25 p-4 text-sm text-muted-foreground">
            The display name is shared by both hero modes.
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70">
          <div className="grid grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)] border-b border-border/70 bg-muted/45 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <div className="px-4 py-3">Field</div>
            <div className="px-4 py-3">Professional</div>
            <div className="px-4 py-3">Tech</div>
          </div>
          <div className="divide-y divide-border/60">
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)] gap-4 px-4 py-4">
                <div className="pt-3 text-sm font-medium text-foreground">{row.label}</div>
                <div>{row.professional}</div>
                <div>{row.tech}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-border/70 bg-muted/20 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">Professional actions</h3>
            <div className="mt-4 grid gap-4">
              <Input
                name="exploreProfessionalLabel"
                defaultValue={hero?.exploreProfessionalLabel ?? ""}
                placeholder="Explore label"
                required
              />
              <Input name="resetViewLabel" defaultValue={hero?.resetViewLabel ?? ""} placeholder="Reset label" required />
              <Input
                name="downloadResumeLabel"
                defaultValue={hero?.downloadResumeLabel ?? ""}
                placeholder="Download resume label"
                required
              />
              <Input name="getInTouchLabel" defaultValue={hero?.getInTouchLabel ?? ""} placeholder="Get in touch label" required />
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-muted/20 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">Tech actions</h3>
            <div className="mt-4 grid gap-4">
              <Input name="exploreTechLabel" defaultValue={hero?.exploreTechLabel ?? ""} placeholder="Explore label" required />
              <Input
                name="viewProjectsLabel"
                defaultValue={hero?.viewProjectsLabel ?? ""}
                placeholder="View projects label"
                required
              />
              <Input name="viewArticlesLabel" defaultValue={hero?.viewArticlesLabel ?? ""} placeholder="View blogs label" required />
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-muted/20 p-4 lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">Homepage labels</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <Input
                name="homeWorkSectionTitle"
                defaultValue={hero?.homeWorkSectionTitle ?? ""}
                placeholder="Home work section title"
                required
              />
              <Input
                name="homeFeaturedArticlesTitle"
                defaultValue={hero?.homeFeaturedArticlesTitle ?? ""}
                placeholder="Home featured blogs title"
                required
              />
              <Input
                name="homeFeaturedProjectsTitle"
                defaultValue={hero?.homeFeaturedProjectsTitle ?? ""}
                placeholder="Home featured projects title"
                required
              />
              <Input
                name="homeViewAllArticlesLabel"
                defaultValue={hero?.homeViewAllArticlesLabel ?? ""}
                placeholder="View all blogs label"
                required
              />
              <Input
                name="homeViewAllProjectsLabel"
                defaultValue={hero?.homeViewAllProjectsLabel ?? ""}
                placeholder="View all projects label"
                required
              />
            </div>
          </section>
        </div>

        <Button type="submit" className="w-fit">
          Save Hero Content
        </Button>
      </form>
    </SettingsSection>
  );
}
