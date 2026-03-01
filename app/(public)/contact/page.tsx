import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactFormCard } from "@/components/sections/contact-form-card";
import { getPageContent, getSiteShellData, getSocialLinksByPosition } from "@/lib/server/queries";
import { Mail, MapPin, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

const asText = (content: Record<string, unknown> | null | undefined, key: string, fallback: string): string => {
  const value = content?.[key];
  return typeof value === "string" ? value : fallback;
};

export default async function ContactPage() {
  let siteConfig: Awaited<ReturnType<typeof getSiteShellData>>["siteConfig"] = null;
  let pageContent: Awaited<ReturnType<typeof getPageContent>> = null;
  let contactSocials: Awaited<ReturnType<typeof getSocialLinksByPosition>> = [];

  try {
    const [shellData, contactContent, socials] = await Promise.all([
      getSiteShellData(),
      getPageContent("CONTACT"),
      getSocialLinksByPosition("CONTACT"),
    ]);
    siteConfig = shellData.siteConfig;
    pageContent = contactContent;
    contactSocials = socials;
  } catch {
    // Render minimal state when database is unavailable.
  }

  const content = pageContent?.content as Record<string, unknown> | null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">{pageContent?.title ?? "Contact"}</h1>
          <p className="text-xl text-muted-foreground">{pageContent?.subtitle ?? ""}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <ContactFormCard
            formTitle={asText(content, "formTitle", "Send a Message")}
            formSubtitle={asText(content, "formSubtitle", "")}
            nameLabel={asText(content, "nameLabel", "Name")}
            emailLabel={asText(content, "emailLabel", "Email")}
            messageLabel={asText(content, "messageLabel", "Message")}
            namePlaceholder={asText(content, "namePlaceholder", "")}
            emailPlaceholder={asText(content, "emailPlaceholder", "")}
            messagePlaceholder={asText(content, "messagePlaceholder", "")}
            sendLabel={pageContent?.primaryCta ?? "Send Message"}
            sendingLabel={pageContent?.secondaryCta ?? "Sending..."}
            successMessage={asText(content, "successMessage", "Message sent successfully")}
            errorMessage={asText(content, "errorMessage", "Failed to send message")}
            unexpectedErrorMessage={asText(content, "unexpectedErrorMessage", "Unexpected error")}
          />

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{asText(content, "infoTitle", "Contact Information")}</CardTitle>
                <CardDescription>{asText(content, "infoSubtitle", "")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{asText(content, "infoEmailLabel", "Email")}</p>
                    <p className="text-muted-foreground">{siteConfig?.primaryEmail ?? ""}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{asText(content, "infoLocationLabel", "Location")}</p>
                    <p className="text-muted-foreground">{asText(content, "infoLocationValue", siteConfig?.locationLabel ?? "")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{asText(content, "infoResponseTimeLabel", "Response Time")}</p>
                    <p className="text-muted-foreground">{asText(content, "infoResponseTimeValue", "")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{asText(content, "socialTitle", "Let's Connect")}</CardTitle>
                <CardDescription>{asText(content, "socialSubtitle", "")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {contactSocials.map((social) => (
                    <Button key={social.id} variant="outline" size="sm" asChild>
                      <a href={social.url} target="_blank" rel="noopener noreferrer">
                        {social.label}
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
