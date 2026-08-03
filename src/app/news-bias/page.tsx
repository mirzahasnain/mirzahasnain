import { BiasTool } from "@/components/news-bias/BiasTool";
import { Footer } from "@/components/news-bias/Footer";
import { Header } from "@/components/news-bias/Header";

export default function NewsBiasPage() {
  return (
    <main className="relative isolate mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.12),transparent_65%)]"
      />

      <Header />
      <BiasTool />
      <div className="mt-auto">
        <Footer />
      </div>
    </main>
  );
}
