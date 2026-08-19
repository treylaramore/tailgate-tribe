import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/cn";
import { FACEBOOK_EVENTS, FACEBOOK_GROUP } from "@/lib/events";
import { getEditorStatus } from "@/lib/site-fns";
import { SiteImage, useSite } from "@/lib/site-provider";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/schedule", label: "Schedule" },
  { to: "/location", label: "Find us" },
  { to: "/tribe", label: "The Tribe" },
  { to: "/faq", label: "FAQ" },
] as const;

function BrandMark() {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <SiteImage slot="logo" alt="" className="h-12 w-auto" />
      <span className="leading-none">
        <span className="block font-display text-[11px] tracking-[0.28em] text-gold">TAILGATE</span>
        <span className="block font-display text-xl tracking-[0.18em] text-cream group-hover:text-gold-soft">
          TRIBE
        </span>
      </span>
    </Link>
  );
}

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  const [editor, setEditor] = useState(false);

  useEffect(() => {
    if (isPending || !user) {
      setEditor(false);
      return;
    }
    getEditorStatus()
      .then((status) => setEditor(status.editor))
      .catch(() => setEditor(false));
  }, [isPending, user]);

  if (isPending) return <div className="h-11 w-24 animate-pulse bg-cream/10" />;
  if (!user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link to="/login">Sign in</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {editor ? (
        <Link to="/studio" className="font-display text-xs tracking-[0.16em] uppercase text-gold hover:text-gold-soft">
          Edit
        </Link>
      ) : null}
      {user.profileImageUrl ? (
        <img src={user.profileImageUrl} alt="" className="size-8 rounded-full object-cover" />
      ) : (
        <span className="grid size-8 place-items-center bg-garnet font-display text-sm text-cream">
          {(user.displayName ?? "T").charAt(0).toUpperCase()}
        </span>
      )}
      <span className="hidden max-w-28 truncate text-sm text-cream sm:inline">{user.displayName ?? "Nole"}</span>
      <button
        type="button"
        onClick={() => void signOut()}
        className="text-xs uppercase tracking-[0.16em] text-muted hover:text-gold"
      >
        Out
      </button>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <header className="sticky top-0 z-40 bg-night/88 backdrop-blur-md">
      <div className="stripe-edge h-1.5 w-full" />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <BrandMark />
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "font-display text-sm tracking-[0.16em] uppercase transition-colors",
                  active ? "text-gold" : "text-cream/80 hover:text-gold",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <AuthSlot />
          </div>
          <button
            type="button"
            className="grid size-11 place-items-center text-cream lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-gold/20 bg-ink px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center font-display text-sm tracking-[0.16em] uppercase text-cream hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 sm:hidden">
            <AuthSlot />
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  const { text } = useSite();
  return (
    <footer className="mt-auto bg-ink">
      <div className="gold-rule" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <SiteImage slot="logo" alt="Tailgate Tribe" className="mb-4 h-44 w-auto" />
          <p className="mt-3 max-w-sm font-display text-3xl uppercase leading-none text-cream">{text("footer_headline")}</p>
          <p className="mt-4 max-w-sm text-sm text-muted">{text("footer_body")}</p>
        </div>
        <div>
          <p className="font-display text-xs tracking-[0.22em] text-gold">ON THIS SITE</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/schedule" className="text-cream hover:text-gold">
                2026 schedule
              </Link>
            </li>
            <li>
              <Link to="/location" className="text-cream hover:text-gold">
                Find the tent
              </Link>
            </li>
            <li>
              <Link to="/tribe" className="text-cream hover:text-gold">
                RSVP & shoutouts
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-cream hover:text-gold">
                How it works
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-display text-xs tracking-[0.22em] text-gold">{text("footer_spot_label")}</p>
          <p className="mt-4 whitespace-pre-line text-sm text-cream">{text("footer_spot")}</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <a href={FACEBOOK_GROUP} target="_blank" rel="noreferrer" className="text-gold hover:text-gold-soft">
              Facebook group
            </a>
            <a href={FACEBOOK_EVENTS} target="_blank" rel="noreferrer" className="text-gold hover:text-gold-soft">
              Tribe events
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gold/15 px-4 py-5 text-center text-xs tracking-[0.16em] text-muted uppercase">
        {text("footer_disclaimer")}
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-night text-cream">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}

export function NotFoundPage() {
  return (
    <SiteShell>
      <main className="mx-auto flex min-h-[60svh] w-full max-w-3xl flex-col justify-center px-4 py-20 sm:px-6">
        <p className="font-display text-xs tracking-[0.28em] text-gold">WRONG LOT</p>
        <h1 className="mt-3 font-display text-5xl uppercase">That page isn't on the map.</h1>
        <p className="mt-4 text-muted">The tent is still east of Lot 8. Try the schedule.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/schedule">Schedule</Link>
          </Button>
        </div>
      </main>
    </SiteShell>
  );
}
