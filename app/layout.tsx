import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";

import { Footer } from "@/components/layout/footer";
import { Background } from "@/components/ui/background";
import { FloatingBlobsBar } from "@/components/ui/floating-blobs-bar";

import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jotin Kumar Madugula - Portfolio",
  description: "Business Process Expert & Full Stack Developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Background>
            <div className="fixed top-[10px] left-0 right-0 z-40 pointer-events-none">
              <FloatingBlobsBar height={68} />
            </div>
            <Header />
            <main className="min-h-screen">
              <div className="max-w-[1280px] mx-auto">{children}</div>
            </main>
            <Footer />
          </Background>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
