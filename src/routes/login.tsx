import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { SiteImage } from "@/lib/site-provider";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } =>
    typeof search.redirect === "string" ? { redirect: search.redirect } : {},
  component: LoginPage,
});

function LoginPage() {
  const { redirect } = Route.useSearch();
  const dest = redirect && redirect.startsWith("/") ? redirect : "/tribe";
  return (
    <main className="relative min-h-svh bg-night text-cream">
      <SiteImage slot="stadium" alt="" className="absolute inset-0 size-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/80 to-night/50" />
      <div className="relative mx-auto flex min-h-svh max-w-md flex-col justify-center px-4 py-16">
        <Link to="/" className="mb-8 font-display text-xs tracking-[0.28em] text-gold">
          ← TAILGATE TRIBE
        </Link>
        <h1 className="font-display text-5xl uppercase">Sign in</h1>
        <p className="mt-3 text-sm text-muted">
          {dest === "/studio"
            ? "Sign in with the Google account that runs the Tribe to change photos and wording."
            : "RSVP a Saturday or post a shout. Google or X — same crew either way."}
        </p>
        <div className="mt-8 space-y-3">
          {GROK_PROVIDERS.map((provider) => (
            <Button
              key={provider.providerId}
              type="button"
              variant={provider.idp === "google" ? "gold" : "outline"}
              className="w-full"
              onClick={() => void signIn(provider.providerId, { callbackURL: dest })}
            >
              Continue with {provider.label}
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
}
