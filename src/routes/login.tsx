import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { SiteImage } from "@/lib/site-provider";

type LoginSearch = { redirect?: string; error?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    const next: LoginSearch = {};
    if (typeof search.redirect === "string") next.redirect = search.redirect;
    if (typeof search.error === "string") next.error = search.error;
    return next;
  },
  component: LoginPage,
});

const BEARER_KEY = "grok-auth.bearer-token";

function safeDest(redirect?: string) {
  if (!redirect) return "/tribe";
  if (!redirect.startsWith("/") || redirect.startsWith("//")) return "/tribe";
  return redirect;
}

function captureAuthToken(response: Response) {
  const token = response.headers.get("set-auth-token");
  if (!token || typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(BEARER_KEY, token);
  } catch {
    /* storage blocked */
  }
}

function friendlyAuthError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const lower = message.toLowerCase();
  if (lower.includes("pop-up") || lower.includes("popup")) {
    return "The sign-in window was blocked. Allow pop-ups for this page, then try Google or X again — or use email below.";
  }
  if (lower.includes("cancelled") || lower.includes("canceled")) {
    return "Sign-in was cancelled. Try again, or use email below.";
  }
  if (lower.includes("invalid origin")) {
    return "This page's address isn't allowed for sign-in. Open the Tribe from its usual link and try again.";
  }
  if (lower.includes("invalid redirect")) {
    return "Google isn't wired for this address yet. Use email below, or add a Google client in The Booth.";
  }
  if (lower.includes("x sign-in isn't available")) {
    return "X isn't wired on this address yet. Use Google or email below.";
  }
  if (lower.includes("invalid password") || lower.includes("invalid email") || lower.includes("invalid credentials")) {
    return "That email or password didn't match.";
  }
  if (lower.includes("user already exists") || lower.includes("already exists")) {
    return "That email already has an account. Sign in instead.";
  }
  return message || fallback;
}

function LoginPage() {
  const { redirect, error: oauthError } = Route.useSearch();
  const dest = safeDest(redirect);
  const [busy, setBusy] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(() => {
    if (oauthError === "google-setup") {
      return "Google isn't connected on this address yet. Use email below, or add a Google client ID in The Booth (Studio).";
    }
    if (oauthError === "google-denied") return "Google sign-in was cancelled. Try again, or use email below.";
    if (oauthError) return "Google sign-in didn't finish. Try again, or use email below.";
    return "";
  });

  async function finishSignedIn() {
    try {
      await authClient.getSession();
    } catch {
      /* session store refreshes on next read */
    }
    if (typeof window !== "undefined") {
      window.location.assign(dest);
    }
  }

  async function onProvider(providerId: string) {
    setError("");
    setBusy(providerId);
    try {
      await signIn(providerId, { callbackURL: dest, errorCallbackURL: `/login?error=1&redirect=${encodeURIComponent(dest)}` });
    } catch (err) {
      const message = friendlyAuthError(err, "Sign-in didn't complete. Allow pop-ups, or use email below.");
      setError(message);
      toast.error(message);
      setBusy(null);
    }
  }

  async function onEmail(event: FormEvent) {
    event.preventDefault();
    setError("");
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail.includes("@")) {
      setError("Need a real email.");
      return;
    }
    if (password.length < 8) {
      setError("Password needs at least 8 characters.");
      return;
    }
    if (mode === "signup") {
      if (!name.trim()) {
        setError("What should we call you?");
        return;
      }
      if (password !== confirm) {
        setError("Those passwords don't match.");
        return;
      }
    }

    setBusy("email");
    try {
      const fetchOptions = {
        onSuccess: (ctx: { response: Response }) => captureAuthToken(ctx.response),
      };
      if (mode === "signup") {
        const { error: signUpError } = await authClient.signUp.email({
          email: trimmedEmail,
          password,
          name: name.trim().slice(0, 40),
        }, fetchOptions);
        if (signUpError) throw new Error(signUpError.message || "Could not create account");
      } else {
        const { error: signInError } = await authClient.signIn.email({
          email: trimmedEmail,
          password,
        }, fetchOptions);
        if (signInError) throw new Error(signInError.message || "Could not sign in");
      }
      toast.success(mode === "signup" ? "You're in. Welcome to the Tribe." : "Signed in.");
      await finishSignedIn();
    } catch (err) {
      const message = friendlyAuthError(err, mode === "signup" ? "Could not create that account." : "Could not sign in.");
      setError(message);
      toast.error(message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="relative min-h-svh bg-night text-cream">
      <SiteImage slot="stadium" alt="" className="pointer-events-none absolute inset-0 size-full object-cover opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night via-night/80 to-night/50" />
      <div className="relative z-10 mx-auto w-full max-w-md px-4 py-14 sm:py-16">
        <Link to="/" className="mb-8 font-display text-xs tracking-[0.28em] text-gold">
          ← TAILGATE TRIBE
        </Link>
        <h1 className="font-display text-5xl uppercase">Sign in</h1>
        <p className="mt-3 text-sm text-muted">
          {dest === "/studio"
            ? "Sign in with the Google account that runs the Tribe to change photos and wording."
            : "RSVP a Saturday or post a shout. Google, X, or email — same crew either way."}
        </p>

        {error ? (
          <p className="mt-5 bg-garnet/80 px-3 py-3 text-sm text-cream" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-8 space-y-3">
          {authEnabled ? (
            GROK_PROVIDERS.map((provider) => (
              <Button
                key={provider.providerId}
                type="button"
                variant={provider.idp === "google" ? "gold" : "outline"}
                className="w-full"
                disabled={busy !== null}
                onClick={() => void onProvider(provider.providerId)}
              >
                {busy === provider.providerId ? "Opening…" : `Continue with ${provider.label}`}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>

        {authEnabled ? (
          <>
            <div className="my-7 flex items-center gap-3">
              <span className="h-px flex-1 bg-gold/25" />
              <span className="font-display text-[11px] tracking-[0.2em] text-muted uppercase">or email</span>
              <span className="h-px flex-1 bg-gold/25" />
            </div>
            <form className="space-y-3" onSubmit={(event) => void onEmail(event)}>
              {mode === "signup" ? (
                <label className="block">
                  <span className="mb-1.5 block text-[11px] tracking-[0.16em] text-muted uppercase">Name</span>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    maxLength={40}
                    autoComplete="name"
                    placeholder="What should we call you?"
                    required
                  />
                </label>
              ) : null}
              <label className="block">
                <span className="mb-1.5 block text-[11px] tracking-[0.16em] text-muted uppercase">Email</span>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  placeholder="you@email.com"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] tracking-[0.16em] text-muted uppercase">Password</span>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                />
              </label>
              {mode === "signup" ? (
                <label className="block">
                  <span className="mb-1.5 block text-[11px] tracking-[0.16em] text-muted uppercase">Confirm password</span>
                  <Input
                    type="password"
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </label>
              ) : null}
              <Button type="submit" variant="outline" className="w-full" disabled={busy !== null}>
                {busy === "email" ? "Working…" : mode === "signup" ? "Create account" : "Sign in with email"}
              </Button>
            </form>
            <button
              type="button"
              className="mt-4 text-left text-sm text-gold hover:text-gold-soft"
              onClick={() => {
                setMode((current) => (current === "signin" ? "signup" : "signin"));
                setError("");
              }}
            >
              {mode === "signin" ? "New here? Create an account" : "Already on the list? Sign in"}
            </button>
            <p className="mt-5 text-xs text-muted">
              Google and X take you to a sign-in page. If that fails, use email below.
            </p>
          </>
        ) : null}
      </div>
    </main>
  );
}
