import type { ReactNode } from "react";
import { TiHeading, TiText } from "@/components/ui/ti";
import { cn } from "@/utils/cn";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-32 flex-col items-center justify-center gap-2 px-4 py-8 text-center",
        className,
      )}
    >
      <TiHeading>{title}</TiHeading>
      {description ? <TiText muted>{description}</TiText> : null}
      {action}
    </div>
  );
}
