import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient, getUser } from "@/lib/supabase-server";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/db-types";
import { Edit, Plus, Trash } from "lucide-react";
import { isAdminEmail } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

async function deleteProject(formData: FormData) {
  "use server";

  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/projects?error=invalid_project_id");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("Project").delete().eq("id", id);

  if (error) {
    redirect("/admin/projects?error=project_delete_failed");
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/admin/projects?success=project_deleted");
}

export default async function ProjectsPage() {
  let projects: Project[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("Project")
      .select("*")
      .order("order", { ascending: true });
    if (error) throw error;
    projects = (data ?? []) as Project[];
  } catch {
    projects = [];
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Projects</h1>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{project.title}</CardTitle>
                <Badge variant={project.featured ? "default" : "secondary"}>
                  {project.featured ? "Featured" : "Standard"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {project.category}
              </p>
              <p>{project.description}</p>
              <p className="text-xs mt-2">Status: {project.status}</p>
              <div className="mt-4 flex items-center gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/projects/${project.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <form action={deleteProject}>
                  <input type="hidden" name="id" value={project.id} />
                  <Button size="sm" variant="destructive" type="submit">
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
