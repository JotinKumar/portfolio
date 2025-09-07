import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await prisma.settings.findFirst();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      {settings ? (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">Resume: {settings.resumeUrl}</p>
            <p className="text-sm mb-2">LinkedIn: {settings.linkedinUrl}</p>
            <p className="text-sm mb-2">GitHub: {settings.githubUrl}</p>
            <p className="text-sm mb-2">Email: {settings.emailAddress}</p>
            <p className="text-sm mb-2">Hero Title: {settings.heroTitle}</p>
            <p className="text-sm mb-2">
              Hero Subtitle: {settings.heroSubtitle}
            </p>
            <p className="text-sm mb-2">About Me: {settings.aboutMe}</p>
          </CardContent>
        </Card>
      ) : (
        <p>No settings found.</p>
      )}
    </div>
  );
}
