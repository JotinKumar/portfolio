import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Background } from "@/components/ui/background";
import { FloatingBlobsBar } from "@/components/ui/floating-blobs-bar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Background>
      <div className="fixed top-[10px] left-0 right-0 z-40 pointer-events-none">
        <FloatingBlobsBar height={68} />
      </div>
      <Header />
      <main className="min-h-screen pt-20">
        <div className="max-w-[1280px] mx-auto">{children}</div>
      </main>
      <Footer />
    </Background>
  );
}