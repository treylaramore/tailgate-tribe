import { cn } from "@/lib/utils";

export function JerseyStripe({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-2 w-full", className)} aria-hidden="true">
      <div className="flex-1 bg-garnet" />
      <div className="w-2.5 bg-gold" />
      <div className="w-1.5 bg-garnet" />
      <div className="w-2.5 bg-gold" />
      <div className="w-1.5 bg-garnet" />
      <div className="w-2.5 bg-gold" />
      <div className="flex-1 bg-garnet" />
    </div>
  );
}
