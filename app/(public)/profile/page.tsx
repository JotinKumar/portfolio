import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Settings, WorkExperienceCard } from "@/lib/db-types";
import { Download, MapPin, Calendar, Mail, Linkedin, Github } from "lucide-react";
import {
  RESUME_CORE_COMPETENCIES,
  RESUME_EXPERIENCES,
  RESUME_LOCATION,
  RESUME_NAME,
  RESUME_SUMMARY,
  RESUME_TITLE,
} from "@/lib/resume-data";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  let settings: Settings | null = null;
  let experienceCards: WorkExperienceCard[] = [];

  try {
    const supabase = await createServerSupabaseClient();
    const [settingsResult, experienceResult] = await Promise.all([
      supabase.from("Settings").select("*").limit(1).maybeSingle(),
      supabase.from("WorkExperienceCard").select("*").order("order", { ascending: true }),
    ]);

    if (settingsResult.error) {
      throw settingsResult.error;
    }
    if (experienceResult.error) {
      throw experienceResult.error;
    }

    settings = (settingsResult.data as Settings | null) ?? null;
    experienceCards = (experienceResult.data ?? []) as WorkExperienceCard[];
  } catch {
    console.log("Database not available, using default values");
  }

  const parseStringArray = (value: string): string[] => {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const experiences =
    experienceCards.length > 0
      ? experienceCards.map((exp) => ({
          id: exp.id,
          company: exp.company,
          role: exp.role,
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.endDate ?? undefined,
          current: exp.current,
          description: exp.description,
          achievements: parseStringArray(exp.achievements),
          skills: parseStringArray(exp.skills),
        }))
      : RESUME_EXPERIENCES;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-6">
          <div className="mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-4xl font-bold text-white">JK</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">{settings?.heroTitle || RESUME_NAME}</h1>
            <p className="text-xl text-muted-foreground mb-4">
              {settings?.heroSubtitle || RESUME_TITLE}
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <a href={settings?.resumeUrl || "/jotin-madugula-resume.pdf"} target="_blank">
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={`mailto:${settings?.emailAddress || "JotinMadugula@gmail.com"}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Me
                </a>
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Professional Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {settings?.aboutMe || RESUME_SUMMARY}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary" />
              <span>{settings?.emailAddress || "JotinMadugula@gmail.com"}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{RESUME_LOCATION}</span>
            </div>
            <Separator />
            <div className="flex space-x-4">
              {settings?.linkedinUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
              )}
              {settings?.githubUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>Professional journey and key achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={exp.id} className={index > 0 ? "border-t pt-6" : ""}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{exp.role}</h3>
                    <p className="text-muted-foreground">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {exp.startDate} - {exp.endDate || "Present"}
                    </div>
                    <div className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {exp.location}
                    </div>
                  </div>
                </div>

                <p className="mb-4 text-muted-foreground">{exp.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Key Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {exp.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Key Achievements</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Core Competencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Commercial & Delivery</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {RESUME_CORE_COMPETENCIES.slice(0, 5).map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Operations & Technology</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {RESUME_CORE_COMPETENCIES.slice(5).map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
