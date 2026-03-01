import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Background } from "@/components/ui/background";
import { FloatingBlobsBar } from "@/components/ui/floating-blobs-bar";
import { APP_SHELL_CLASS } from "@/lib/layout";
import { getSiteShellData } from "@/lib/server/queries";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const shellData = await getSiteShellData();
    if (!shellData.siteConfig) return {};

    return {
      title: shellData.siteConfig.defaultTitle,
      description: shellData.siteConfig.defaultDescription,
    };
  } catch {
    return {};
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let shellData: Awaited<ReturnType<typeof getSiteShellData>> = {
    siteConfig: null,
    headerNav: [],
    footerQuickLinks: [],
    footerResourceLinks: [],
    footerLegalLinks: [],
    footerSocialLinks: [],
  };

  try {
    shellData = await getSiteShellData();
  } catch {
    // Render with empty shell data when database is unavailable.
  }

  return (
    <Background>
      <div className="fixed top-[10px] left-0 right-0 z-40 pointer-events-none">
        <FloatingBlobsBar height={68} />
      </div>
      <Header siteConfig={shellData.siteConfig} navigationItems={shellData.headerNav} />
      <main className="min-h-screen pt-20">
        <div className={APP_SHELL_CLASS}>{children}</div>
      </main>
      <Footer
        siteConfig={shellData.siteConfig}
        socialLinks={shellData.footerSocialLinks}
        quickLinks={shellData.footerQuickLinks}
        resourceLinks={shellData.footerResourceLinks}
        legalLinks={shellData.footerLegalLinks}
      />
    </Background>
  );
}
