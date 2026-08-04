import { Suspense } from "react";
import { BiasTool } from "@/components/news-bias/BiasTool";
import { Footer } from "@/components/news-bias/Footer";
import { Header } from "@/components/news-bias/Header";

export default function NewsBiasPage() {
  return (
    <main className="relative isolate mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col gap-8 px-5 py-8 sm:px-6 sm:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--nb-accent)_18%,transparent),transparent_65%)]"
      />

      <Header />
      <Suspense
        fallback={
          <div className="h-40 animate-pulse rounded-xl bg-nb-elevated" aria-hidden />
        }
      >
        <BiasTool />
      </Suspense>
      <div className="mt-auto pt-4">
        <Footer />
      </div>
    </main>
  );
}
