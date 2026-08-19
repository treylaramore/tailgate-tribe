import { createFileRoute } from "@tanstack/react-router";
import {
  CANONICAL_VERCEL_ORIGIN,
  createAppSession,
  decodeOauthCookie,
  getGoogleCredentials,
  googleCallbackUrl,
  readCookie,
  sanitizeRedirect,
  sessionCookieHeader,
  stateCookieHeader,
} from "@/lib/auth/google-oauth.server";

export const Route = createFileRoute("/api/auth/google/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const fail = (code: string) => {
          const back = new URL("/login", CANONICAL_VERCEL_ORIGIN);
          back.searchParams.set("error", code);
          const headers = new Headers({ Location: back.toString() });
          headers.append("Set-Cookie", stateCookieHeader(null));
          return new Response(null, { status: 302, headers });
        };

        if (url.searchParams.get("error")) return fail("google-denied");
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const stored = decodeOauthCookie(readCookie(request, "tt_google_oauth"));
        if (!code || !state || !stored || stored.state !== state) return fail("google-state");

        const creds = await getGoogleCredentials();
        if (!creds) return fail("google-setup");

        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            client_id: creds.clientId,
            client_secret: creds.clientSecret,
            redirect_uri: googleCallbackUrl(),
            code_verifier: stored.verifier,
          }),
        });
        if (!tokenRes.ok) return fail("google-token");
        const tokens = (await tokenRes.json()) as { access_token?: string };
        if (!tokens.access_token) return fail("google-token");

        const profileRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        if (!profileRes.ok) return fail("google-profile");
        const profile = (await profileRes.json()) as {
          sub?: string;
          email?: string;
          name?: string;
          picture?: string;
        };
        if (!profile.sub || !profile.email) return fail("google-profile");

        try {
          const token = await createAppSession({
            email: profile.email,
            name: profile.name || profile.email,
            image: profile.picture ?? null,
            googleId: profile.sub,
          });
          const dest = new URL(sanitizeRedirect(stored.redirect), CANONICAL_VERCEL_ORIGIN);
          const headers = new Headers({ Location: dest.toString() });
          headers.append("Set-Cookie", sessionCookieHeader(token, 60 * 60 * 24 * 30));
          headers.append("Set-Cookie", stateCookieHeader(null));
          return new Response(null, { status: 302, headers });
        } catch {
          return fail("google-session");
        }
      },
    },
  },
});
