import Link from "next/link";
import { routes } from "@/config/routes";
import { application } from "@/config/application";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm uppercase tracking-widest text-slate-500">404</p>
      <h1 className="text-2xl font-semibold text-slate-100">Page not found</h1>
      <p className="text-sm text-slate-400">
        That route does not exist in {application.name}.
      </p>
      <Link
        href={routes.workspace}
        className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950"
      >
        Go to Workspace
      </Link>
    </main>
  );
}
