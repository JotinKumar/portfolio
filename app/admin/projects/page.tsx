import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Project } from "@/lib/db-types";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("Project")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    throw error;
  }

  const projects = (data ?? []) as Project[];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {project.category}
              </p>
              <p>{project.description}</p>
              <p className="text-xs mt-2">Status: {project.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
