import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-display uppercase tracking-[0.14em] transition-transform duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-50 active:not-disabled:scale-[0.96]",
  {
    variants: {
      variant: {
        gold: "bg-gold text-night hover:bg-gold-soft",
        outline:
          "bg-transparent text-cream shadow-[0_0_0_1px_rgba(243,230,200,0.28)] hover:shadow-[0_0_0_1px_rgba(201,162,74,0.7)] hover:text-gold-soft",
        ghost: "bg-transparent text-cream hover:text-gold",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        default: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "gold",
      size: "default",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
