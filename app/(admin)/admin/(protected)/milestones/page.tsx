import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isAdminEmail } from "@/lib/admin-auth";
import type { ProfileMilestone } from "@/lib/db-types";
import { createServerSupabaseClient, getUser } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

async function createMilestone(formData: FormData) {
  "use server";

  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin");
  }

  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    month: String(formData.get("month") ?? "").trim(),
    year: Number(formData.get("year") ?? 0) || 0,
    order: Number(formData.get("order") ?? 0) || 0,
    visible: formData.get("visible") === "on",
  };

  if (!payload.title || !payload.month || payload.year <= 0) {
    redirect("/admin/milestones?error=invalid_milestone_payload");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("ProfileMilestone").insert(payload);

  if (error) {
    redirect("/admin/milestones?error=milestone_create_failed");
  }

  revalidatePath("/admin/milestones");
  revalidatePath("/profile");
  redirect("/admin/milestones?success=milestone_created");
}

async function updateMilestone(formData: FormData) {
  "use server";

  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/milestones?error=invalid_milestone_id");
  }

  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    month: String(formData.get("month") ?? "").trim(),
    year: Number(formData.get("year") ?? 0) || 0,
    order: Number(formData.get("order") ?? 0) || 0,
    visible: formData.get("visible") === "on",
  };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("ProfileMilestone").update(payload).eq("id", id);

  if (error) {
    redirect("/admin/milestones?error=milestone_update_failed");
  }

  revalidatePath("/admin/milestones");
  revalidatePath("/profile");
  redirect("/admin/milestones?success=milestone_updated");
}

async function deleteMilestone(formData: FormData) {
  "use server";

  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/milestones?error=invalid_milestone_id");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("ProfileMilestone").delete().eq("id", id);

  if (error) {
    redirect("/admin/milestones?error=milestone_delete_failed");
  }

  revalidatePath("/admin/milestones");
  revalidatePath("/profile");
  redirect("/admin/milestones?success=milestone_deleted");
}

export default async function MilestonesPage() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("ProfileMilestone").select("*").order("order", { ascending: true });
  const milestones = error ? [] : ((data ?? []) as ProfileMilestone[]);
  const tableReady = !error;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Profile Milestones"
        description="Manage the milestone rail shown in the home page work-experience section."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(15rem,0.28fr)_minmax(0,0.72fr)] lg:items-start">
        <aside className="space-y-7 border border-border/70 bg-card/74 p-5 lg:sticky lg:top-28 lg:self-start">
          <div className="space-y-3 border-b border-border/60 pb-5">
            <p className="type-meta text-muted-foreground">Profile milestones</p>
            <h2 className="type-section-title text-[2.2rem] leading-[0.92]">Milestones</h2>
            <p className="type-body text-muted-foreground">
              Control the timeline rail years, milestone labels, and the order they appear in on the home page experience section.
            </p>
          </div>

          <div className="space-y-3">
            <p className="type-meta text-muted-foreground">Overview</p>
            <div className="space-y-2">
              <p className="type-body">{milestones.length} total milestones</p>
              <p className="type-body text-muted-foreground">Visible milestones render in the compact year rail and milestone legend.</p>
            </div>
          </div>
        </aside>

        <section className="space-y-6 border border-border/70 bg-card/62 p-6 md:p-8">
          {!tableReady ? (
            <Card className="border-border/60 bg-background/60">
              <CardHeader>
                <CardTitle className="text-base">Migration required</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="type-body text-muted-foreground">
                  The `ProfileMilestone` table is not available in the connected database yet. Apply the pending migration, then reload this page.
                </p>
              </CardContent>
            </Card>
          ) : null}

          <Card className="border-border/60 bg-background/60">
            <CardHeader>
              <CardTitle className="text-base">Add Milestone</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createMilestone} className="grid gap-4 md:grid-cols-2">
                <Input name="title" placeholder="Milestone title" />
                <Input name="month" placeholder="Month (e.g. Apr)" />
                <Input name="year" type="number" placeholder="Year (e.g. 2016)" />
                <Input name="order" type="number" placeholder="Display order" />
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" name="visible" defaultChecked />
                  Visible on profile
                </label>
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" disabled={!tableReady}>Create Milestone</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {milestones.map((milestone) => (
            <form key={milestone.id} action={updateMilestone} className="space-y-4 border-t border-border/60 pt-6 first:border-t-0 first:pt-0">
              <input type="hidden" name="id" value={milestone.id} />

              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_7rem_7rem_7rem]">
                <Input name="title" defaultValue={milestone.title} />
                <Input name="month" defaultValue={milestone.month} />
                <Input name="year" type="number" defaultValue={milestone.year} />
                <Input name="order" type="number" defaultValue={milestone.order} />
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" name="visible" defaultChecked={milestone.visible} />
                  Visible on profile
                </label>

                <div className="flex gap-2">
                  <Button type="submit" disabled={!tableReady}>Save Milestone</Button>
                  <Button formAction={deleteMilestone} variant="outline" disabled={!tableReady}>
                    Delete
                  </Button>
                </div>
              </div>
            </form>
          ))}
        </section>
      </div>
    </div>
  );
}
