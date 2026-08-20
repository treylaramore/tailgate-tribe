import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TentMark } from "@/components/TentMark";
import { JerseyStripe } from "@/components/JerseyStripe";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/schedule", label: "Schedule" },
  { to: "/gameday", label: "Gameday" },
  { to: "/find-us", label: "Find us" },
  { to: "/the-tribe", label: "The Tribe" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const overHero = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-200",
        open || !overHero
          ? "border-b border-border bg-ink"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <JerseyStripe />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-gold focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 text-cream">
          <TentMark className="size-8" />
          <span className="font-display text-xl tracking-wide uppercase sm:text-2xl">
            Tailgate Tribe
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative py-2 text-sm font-medium transition-colors duration-150",
                  active ? "text-gold" : "text-cream/80 hover:text-gold",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-px bg-gold transition-opacity duration-150",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Button asChild size="sm">
              <a href={SITE.facebookGroup} target="_blank" rel="noreferrer">
                Join the group
              </a>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-x-0 top-14 bottom-0 z-40 bg-ink px-6 py-8 lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col gap-2" aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "min-h-11 rounded-md px-3 py-3 font-display text-3xl uppercase tracking-wide",
                pathname === item.to ? "text-gold" : "text-cream",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild className="mt-6 h-12">
            <a href={SITE.facebookGroup} target="_blank" rel="noreferrer">
              Join the Facebook group
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
