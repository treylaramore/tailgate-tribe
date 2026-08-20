import { cn } from "@/lib/utils";

export function TentMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("size-9", className)}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="10" fill="currentColor" className="text-garnet" />
      <path
        d="M24 6c2.4 3.2 4.4 4.6 4.4 7.2 0 2.4-2 4.2-4.4 4.2s-4.4-1.8-4.4-4.2c0-2.6 2-4 4.4-7.2Z"
        fill="currentColor"
        className="text-gold"
      />
      <rect x="22" y="16" width="4" height="12" rx="1" fill="currentColor" className="text-gold" />
      <path
        d="M24 42 14 26h20L24 42Z"
        fill="currentColor"
        className="text-gold"
      />
      <path
        d="M24 36 18 28h12L24 36Z"
        fill="currentColor"
        className="text-garnet-dark"
      />
    </svg>
  );
}
