"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building } from "lucide-react";

interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  skills: string[];
}

export function WorkTimeline({
  experiences,
  title,
}: {
  experiences: Experience[];
  title: string;
}) {
  const parseSkills = (skills: Experience["skills"]): string[] => {
    if (Array.isArray(skills)) {
      return skills;
    }
    try {
      const parsed = JSON.parse(skills || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return (
    <section className="py-10 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-8">
          {title}
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

          {/* Scrollable container */}
          <div className="flex items-stretch gap-8 overflow-x-auto pb-4">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-80 h-full [content-visibility:auto]"
              >
                <Card className="h-[470px] p-6 grid grid-rows-[auto_auto_auto_1fr_auto] gap-4 hover:shadow-lg transition-shadow">
                  <div className="min-h-6 flex items-start justify-end">
                    {exp.current ? (
                      <Badge variant="default">Current</Badge>
                    ) : (
                      <span className="h-6" />
                    )}
                  </div>

                  <div className="min-h-[84px] flex items-start gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-xl leading-tight">
                        {exp.role}
                      </h3>
                      <p className="mt-2 text-muted-foreground flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {exp.company}
                      </p>
                    </div>
                  </div>

                  <div className="min-h-[52px] space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {exp.location}
                    </p>
                    <p className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {exp.startDate} - {exp.endDate || "Present"}
                    </p>
                  </div>

                  <p className="pt-4 text-sm leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="min-h-[52px] flex flex-wrap content-start gap-1">
                    {parseSkills(exp.skills).slice(0, 3).map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs whitespace-nowrap"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
