import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Settings, WorkExperience } from '@/lib/db-types';
import { Download, MapPin, Calendar, Mail, Linkedin, Github } from 'lucide-react';

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  let settings: Settings | null = null;
  let experiences: WorkExperience[] = [];
  
  try {
    const supabase = await createServerSupabaseClient();

    // Fetch settings and work experience
    const [settingsResult, experiencesResult] = await Promise.all([
      supabase.from('Settings').select('*').limit(1).maybeSingle(),
      supabase.from('WorkExperience').select('*').order('order', { ascending: true }),
    ]);

    if (settingsResult.error) {
      throw settingsResult.error;
    }
    if (experiencesResult.error) {
      throw experiencesResult.error;
    }

    settings = (settingsResult.data as Settings | null) ?? null;
    experiences = (experiencesResult.data ?? []) as WorkExperience[];
  } catch {
    console.log('Database not available, using default values');
  }

  const parseStringArray = (value: string): string[] => {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-4xl font-bold text-white">JK</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">{settings?.heroTitle || 'Jotin Kumar Madugula'}</h1>
            <p className="text-xl text-muted-foreground mb-4">
              {settings?.heroSubtitle || 'Business Process Expert & AI Enthusiast'}
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <a href={settings?.resumeUrl || '/resume.pdf'} target="_blank">
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={`mailto:${settings?.emailAddress || 'contact@jotin.in'}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Me
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {settings?.aboutMe || 'Transforming operations through intelligent automation...'}
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary" />
              <span>{settings?.emailAddress || 'contact@jotin.in'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Remote • Available Globally</span>
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

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>My professional journey and key achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={exp.id} className={index > 0 ? 'border-t pt-6' : ''}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{exp.role}</h3>
                    <p className="text-muted-foreground">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                      {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                    </div>
                    <div className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {exp.location}
                    </div>
                  </div>
                </div>
                
                <p className="mb-4 text-muted-foreground">{exp.description}</p>
                
                {/* Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Key Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {parseStringArray(exp.skills).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Achievements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {parseStringArray(exp.achievements).map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Core Competencies */}
        <Card>
          <CardHeader>
            <CardTitle>Core Competencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Business Process Optimization</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Process Analysis & Mapping</li>
                  <li>• Workflow Automation</li>
                  <li>• Performance Metrics & KPIs</li>
                  <li>• Continuous Improvement</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Technology & Innovation</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• AI & Machine Learning</li>
                  <li>• Robotic Process Automation</li>
                  <li>• Digital Transformation</li>
                  <li>• Data Analytics</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
