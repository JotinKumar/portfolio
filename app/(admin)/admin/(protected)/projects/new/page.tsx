import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createServerSupabaseClient, getUser } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createProject(formData: FormData) {
  "use server";

  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin");
  }

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugInput || slugify(title);

  if (!title || !slug) {
    redirect("/admin/projects/new?error=missing_required_fields");
  }

  const payload = {
    title,
    slug,
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
  const { error } = await supabase.from("Project").insert(payload);
  if (error) {
    redirect("/admin/projects/new?error=project_create_failed");
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects?success=project_created");
}

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New Project</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/projects">Back to Projects</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createProject} className="grid gap-4">
            <Input name="title" placeholder="Title" required />
            <Input name="slug" placeholder="Slug (optional, auto-generated)" />
            <Input name="shortDesc" placeholder="Short description" required />
            <textarea
              name="description"
              className="min-h-[160px] w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Full description"
              required
            />
            <Input name="category" placeholder="Category" required />
            <Input name="status" placeholder="Status (completed/in-progress/planned)" defaultValue="in-progress" required />
            <Input name="order" type="number" defaultValue={0} required />
            <Input name="coverImage" placeholder="Cover image URL" required />
            <Input name="screenshots" placeholder="Screenshots (comma separated URLs/text)" required />
            <Input name="techStack" placeholder="Tech stack (comma separated)" required />
            <Input name="tags" placeholder="Tags (comma separated)" required />
            <Input name="liveUrl" placeholder="Live URL (optional)" />
            <Input name="githubUrl" placeholder="GitHub URL (optional)" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" /> Featured
            </label>
            <Button type="submit">Create Project</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
