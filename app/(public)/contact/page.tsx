import { Button } from "@/components/ui/button";
import { PageContent, PageHeader } from "@/components/layout/page-primitives";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactFormCard } from "@/components/contact/contact-form-card";
import { PAGE_SECTION_Y_CLASS } from "@/lib/layout";
import { getPageContent, getSiteShellData, getSocialLinksByPosition } from "@/lib/server/queries";
import { Mail, MapPin, Clock, Phone } from "lucide-react";
import { isExternalSocialLink, normalizeSocialPlatform, resolveSocialLinkDisplayValue, resolveSocialLinkTarget } from "@/lib/social-links";

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
  const contactInfoRows = contactSocials.filter((item) => item.kind === "CONTACT");
  const socialRows = contactSocials.filter((item) => item.kind === "SOCIAL" && resolveSocialLinkTarget(item));

  return (
    <section className={PAGE_SECTION_Y_CLASS}>
      <PageContent className="space-y-10">
        <PageHeader title={pageContent?.title ?? "Contact"} subtitle={pageContent?.subtitle ?? ""} />

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
                {contactInfoRows.length > 0 ? (
                  contactInfoRows.map((social) => {
                    const Icon = iconForPlatform(social.platform);
                    const href = resolveSocialLinkTarget(social);
                    const value = resolveSocialLinkDisplayValue(social);

                    return (
                      <div key={social.id} className="flex items-start space-x-3">
                        <Icon className="mt-0.5 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{social.label}</p>
                          {href ? (
                            <a
                              href={href}
                              target={isExternalSocialLink(social) ? "_blank" : undefined}
                              rel={isExternalSocialLink(social) ? "noopener noreferrer" : undefined}
                              className="text-muted-foreground transition-colors hover:text-foreground"
                            >
                              {value}
                            </a>
                          ) : (
                            <p className="text-muted-foreground">{value}</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="flex items-start space-x-3">
                      <Mail className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{asText(content, "infoEmailLabel", "Email")}</p>
                        <p className="text-muted-foreground">{siteConfig?.primaryEmail ?? ""}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{asText(content, "infoLocationLabel", "Location")}</p>
                        <p className="text-muted-foreground">{asText(content, "infoLocationValue", siteConfig?.locationLabel ?? "")}</p>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex items-start space-x-3">
                  <Clock className="mt-0.5 h-5 w-5 text-primary" />
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
                  {socialRows.map((social) => {
                    const href = resolveSocialLinkTarget(social);

                    if (!href) {
                      return null;
                    }

                    return (
                      <Button key={social.id} variant="outline" size="sm" asChild>
                        <a href={href} target={isExternalSocialLink(social) ? "_blank" : undefined} rel={isExternalSocialLink(social) ? "noopener noreferrer" : undefined}>
                          {social.label}
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContent>
    </section>
  );
}

function iconForPlatform(platform: string) {
  const normalized = normalizeSocialPlatform(platform);
  if (normalized === "location") return MapPin;
  if (normalized === "phone" || normalized === "whatsapp") return Phone;
  return Mail;
}
