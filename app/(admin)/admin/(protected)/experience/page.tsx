import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isAdminEmail } from "@/lib/admin-auth";
import type { WorkExperienceCard } from "@/lib/db-types";
import { createServerSupabaseClient, getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function updateExperience(formData: FormData) {
  "use server";

  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/experience?error=invalid_experience_id");
  }

  const payload = {
    role: String(formData.get("role") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    startDate: String(formData.get("startDate") ?? "").trim(),
    endDate: String(formData.get("endDate") ?? "").trim() || null,
    order: Number(formData.get("order") ?? 0) || 0,
    current: formData.get("current") === "on",
    description: String(formData.get("description") ?? "").trim(),
    achievements: String(formData.get("achievements") ?? "").trim(),
    skills: String(formData.get("skills") ?? "").trim(),
  };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("WorkExperienceCard").update(payload).eq("id", id);

  if (error) {
    redirect("/admin/experience?error=experience_update_failed");
  }

  revalidatePath("/admin/experience");
  revalidatePath("/profile");
  revalidatePath("/");
  redirect("/admin/experience?success=experience_updated");
}

export default async function ExperiencePage() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("WorkExperienceCard").select("*").order("order", { ascending: true });

  if (error) {
    throw error;
  }

  const experiences = (data ?? []) as WorkExperienceCard[];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Work Experience"
        description="This editor mirrors the profile timeline structure so the admin view reads like the public profile, but stays editable."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(15rem,0.28fr)_minmax(0,0.72fr)] lg:items-start">
        <aside className="space-y-7 border border-border/70 bg-card/74 p-5 lg:sticky lg:top-28 lg:self-start">
          <div className="space-y-3 border-b border-border/60 pb-5">
            <p className="type-meta text-muted-foreground">Profile-aligned editor</p>
            <h2 className="type-section-title text-[2.2rem] leading-[0.92]">Experience</h2>
            <p className="type-body text-muted-foreground">
              Edit the same timeline structure used on the public profile page. Ordering, dates, achievements, and skills remain the primary controls.
            </p>
          </div>

          <div className="space-y-3">
            <p className="type-meta text-muted-foreground">Overview</p>
            <div className="space-y-2">
              <p className="type-body">{experiences.length} total entries</p>
              <p className="type-body text-muted-foreground">Each card should read like a published profile section, not a detached CMS record.</p>
            </div>
          </div>

          <Button className="w-full" disabled>
            Save controls next
          </Button>
        </aside>

        <section className="space-y-6 border border-border/70 bg-card/62 p-6 md:p-8">
          <div className="space-y-3 border-b border-border/60 pb-5">
            <p className="type-meta text-muted-foreground">Experience</p>
            <h2 className="type-section-title">Profile Timeline</h2>
            <p className="type-body text-muted-foreground">Each block keeps the public timeline rhythm while exposing editable values inline.</p>
          </div>

          {experiences.map((exp) => (
            <form key={exp.id} action={updateExperience} className="space-y-4 border-t border-border/60 pt-6 first:border-t-0 first:pt-0">
              <input type="hidden" name="id" value={exp.id} />

              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Input name="role" defaultValue={exp.role} className="h-auto border-0 px-0 text-2xl font-semibold shadow-none focus-visible:ring-0" />
                    {exp.current ? <Badge>Current</Badge> : null}
                  </div>
                  <Input name="company" defaultValue={exp.company} className="h-auto max-w-md border-0 px-0 text-base text-muted-foreground shadow-none focus-visible:ring-0" />
                </div>

                <div className="grid gap-2 md:min-w-[16rem]">
                  <Input name="startDate" defaultValue={exp.startDate} />
                  <Input name="endDate" defaultValue={exp.endDate ?? ""} placeholder="Leave empty when current" />
                  <Input name="location" defaultValue={exp.location} />
                  <Input name="order" type="number" defaultValue={exp.order} />
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" name="current" defaultChecked={exp.current} />
                    Current role
                  </label>
                </div>
              </div>

              <Textarea name="description" defaultValue={exp.description} className="min-h-[120px]" />

              <Card className="border-border/60 bg-background/60">
                <CardHeader>
                  <CardTitle className="text-base">Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea name="achievements" defaultValue={exp.achievements} className="min-h-[120px]" />
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-background/60">
                <CardHeader>
                  <CardTitle className="text-base">Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input name="skills" defaultValue={exp.skills} />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit">Save Entry</Button>
              </div>
            </form>
          ))}
        </section>
      </div>
    </div>
  );
}
