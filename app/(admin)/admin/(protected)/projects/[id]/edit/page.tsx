import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowLeft, Clock3, FileImage, Layers3, Tag } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isAdminEmail } from "@/lib/admin-auth";
import type { Project } from "@/lib/db-types";
import { createServerSupabaseClient, getUser } from "@/lib/supabase-server";

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
        <AdminPageHeader title="Edit Project" />
        <Card>
          <CardContent className="space-y-3 p-6">
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
  const techCount = project.techStack ? project.techStack.split(",").map((item) => item.trim()).filter(Boolean).length : 0;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Project"
        description="Edit the project using the same composition as the public case-study page: header, media, overview, stack, and outbound links."
        action={
          <Button variant="outline" asChild>
            <Link href="/admin/projects">Back to Projects</Link>
          </Button>
        }
      />

      <form action={updateProject} className="space-y-6">
        <input type="hidden" name="id" defaultValue={project.id} />

        <section className="space-y-5 rounded-2xl border bg-card/70 p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{project.category}</Badge>
              <Badge variant={project.status === "completed" ? "default" : "outline"}>{project.status}</Badge>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="space-y-4">
              <Input
                name="title"
                defaultValue={project.title}
                required
                className="h-auto border-0 px-0 text-3xl font-black tracking-tight shadow-none focus-visible:ring-0 md:text-5xl"
              />
              <Textarea
                name="shortDesc"
                defaultValue={project.shortDesc}
                required
                className="min-h-[96px] border-0 px-0 text-base text-muted-foreground shadow-none focus-visible:ring-0 md:text-lg"
              />
            </div>

            <div className="space-y-4 rounded-2xl border border-border/60 bg-background/70 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="h-4 w-4" />
                Ordered at position {project.order}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Layers3 className="h-4 w-4" />
                {techCount} technologies
              </div>
              <Input name="category" defaultValue={project.category} required />
              <Input name="status" defaultValue={project.status} required />
              <Input name="order" type="number" defaultValue={project.order} required />
              <Input name="slug" defaultValue={project.slug} required />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border bg-muted/35 p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <FileImage className="h-4 w-4" />
            Project media
          </div>
          <Input name="coverImage" defaultValue={project.coverImage} required />
          <Input name="screenshots" defaultValue={project.screenshots} required />
        </section>

        <section className="space-y-4 rounded-2xl border bg-background/80 p-6 md:p-8">
          <h2 className="text-xl font-semibold md:text-2xl">Project Overview</h2>
          <Textarea
            aria-label="project description"
            name="description"
            className="min-h-[220px] whitespace-pre-wrap"
            defaultValue={project.description}
            required
          />
        </section>

        <section className="space-y-4 rounded-2xl border bg-card/60 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Layers3 className="h-4 w-4" />
            Technology stack
          </div>
          <Input name="techStack" defaultValue={project.techStack} required />
        </section>

        <section className="space-y-4 rounded-2xl border bg-card/60 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Tag className="h-4 w-4" />
            Concepts and links
          </div>
          <Input name="tags" defaultValue={project.tags} required />
          <Input name="liveUrl" defaultValue={project.liveUrl ?? ""} placeholder="Live demo URL" />
          <Input name="githubUrl" defaultValue={project.githubUrl ?? ""} placeholder="Source code URL" />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Display Controls</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" defaultChecked={project.featured} /> Featured
            </label>
            <Button type="submit">Save Changes</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
