import Link from "next/link";
import { routes } from "@/config/routes";
import { application } from "@/config/application";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center text-nb-text">
      <p className="text-sm uppercase tracking-widest text-nb-faint">404</p>
      <h1 className="text-2xl font-semibold text-nb-text">Page not found</h1>
      <p className="text-sm text-nb-muted">
        That route does not exist in {application.name}. Return to Workspace to continue.
      </p>
      <Link
        href={routes.workspace}
        className="inline-flex min-h-11 items-center rounded-full bg-nb-accent px-5 text-sm font-semibold text-nb-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
      >
        Go to Workspace
      </Link>
    </main>
  );
}
