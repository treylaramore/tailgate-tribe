import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full bg-ink px-3 py-2 text-sm text-cream shadow-[0_0_0_1px_rgba(243,230,200,0.16)] outline-none placeholder:text-muted focus:shadow-[0_0_0_1px_rgba(201,162,74,0.7)]",
        className,
      )}
      {...props}
    />
  );
}
