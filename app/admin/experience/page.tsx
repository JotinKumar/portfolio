import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { WorkExperienceCard } from "@/lib/db-types";

export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("WorkExperienceCard")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    throw error;
  }

  const experiences = (data ?? []) as WorkExperienceCard[];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Work Experience</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {experiences.map((exp) => (
          <Card key={exp.id}>
            <CardHeader>
              <CardTitle>
                {exp.role} @ {exp.company}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {exp.location}
              </p>
              <p>{exp.description}</p>
              <p className="text-xs mt-2">
                {exp.startDate} - {exp.endDate || "Present"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
