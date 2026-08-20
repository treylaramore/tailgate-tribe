import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "gold",
  children,
}: {
  className?: string;
  tone?: "gold" | "garnet" | "live" | "muted";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-wide uppercase",
        tone === "gold" && "bg-gold text-ink",
        tone === "garnet" && "bg-garnet text-cream",
        tone === "live" && "bg-cream text-garnet",
        tone === "muted" && "border border-border text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
