import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createServerSupabaseClient, getUser } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin-auth";
import type { Project } from "@/lib/db-types";

export const dynamic = "force-dynamic";

async function updateProject(formData: FormData) {
  "use server";

  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/projects");
  }

  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    shortDesc: String(formData.get("shortDesc") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    status: String(formData.get("status") ?? "").trim() || "in-progress",
    order: Number(formData.get("order") ?? 0) || 0,
    featured: formData.get("featured") === "on",
    liveUrl: String(formData.get("liveUrl") ?? "").trim() || null,
    githubUrl: String(formData.get("githubUrl") ?? "").trim() || null,
    coverImage: String(formData.get("coverImage") ?? "").trim(),
    screenshots: String(formData.get("screenshots") ?? "").trim(),
    techStack: String(formData.get("techStack") ?? "").trim(),
    tags: String(formData.get("tags") ?? "").trim(),
  };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("Project").update(payload).eq("id", id);
  if (error) {
    redirect(`/admin/projects/${id}/edit?error=project_update_failed`);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/admin/projects?success=project_updated");
}

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("Project").select("*").eq("id", id).maybeSingle();

  if (error || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Edit Project</h1>
        <Card>
          <CardContent className="p-6 space-y-3">
            <p className="text-muted-foreground">Project not found.</p>
            <Button variant="outline" asChild>
              <Link href="/admin/projects">Back to Projects</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const project = data as Project;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Project</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/projects">Back to Projects</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateProject} className="grid gap-4">
            <input type="hidden" name="id" defaultValue={project.id} />
            <Input name="title" defaultValue={project.title} required />
            <Input name="slug" defaultValue={project.slug} required />
            <Input name="shortDesc" defaultValue={project.shortDesc} required />
            <textarea
              name="description"
              className="min-h-[160px] w-full rounded-md border bg-background px-3 py-2 text-sm"
              defaultValue={project.description}
              required
            />
            <Input name="category" defaultValue={project.category} required />
            <Input name="status" defaultValue={project.status} required />
            <Input name="order" type="number" defaultValue={project.order} required />
            <Input name="coverImage" defaultValue={project.coverImage} required />
            <Input name="screenshots" defaultValue={project.screenshots} required />
            <Input name="techStack" defaultValue={project.techStack} required />
            <Input name="tags" defaultValue={project.tags} required />
            <Input name="liveUrl" defaultValue={project.liveUrl ?? ""} />
            <Input name="githubUrl" defaultValue={project.githubUrl ?? ""} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" defaultChecked={project.featured} /> Featured
            </label>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
