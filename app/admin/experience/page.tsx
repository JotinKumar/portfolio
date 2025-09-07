import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  const experiences = await prisma.workExperience.findMany({
    orderBy: { order: "asc" },
  });

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
                {exp.startDate instanceof Date
                  ? exp.startDate.toLocaleDateString()
                  : exp.startDate}{" "}
                -{" "}
                {exp.endDate
                  ? exp.endDate instanceof Date
                    ? exp.endDate.toLocaleDateString()
                    : exp.endDate
                  : "Present"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
