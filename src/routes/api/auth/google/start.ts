import { createFileRoute } from "@tanstack/react-router";
import {
  CANONICAL_VERCEL_ORIGIN,
  challengeS256,
  encodeOauthCookie,
  getGoogleCredentials,
  googleCallbackUrl,
  newOauthState,
  sanitizeRedirect,
  stateCookieHeader,
} from "@/lib/auth/google-oauth.server";

export const Route = createFileRoute("/api/auth/google/start")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const dest = sanitizeRedirect(url.searchParams.get("redirect"));
        const creds = await getGoogleCredentials();
        if (!creds) {
          const back = new URL("/login", request.url);
          back.searchParams.set("error", "google-setup");
          back.searchParams.set("redirect", dest);
          return Response.redirect(back, 302);
        }

        const oauth = newOauthState(dest);
        const challenge = await challengeS256(oauth.verifier);
        const google = new URL("https://accounts.google.com/o/oauth2/v2/auth");
        google.searchParams.set("client_id", creds.clientId);
        google.searchParams.set("redirect_uri", googleCallbackUrl());
        google.searchParams.set("response_type", "code");
        google.searchParams.set("scope", "openid email profile");
        google.searchParams.set("state", oauth.state);
        google.searchParams.set("code_challenge", challenge);
        google.searchParams.set("code_challenge_method", "S256");
        google.searchParams.set("prompt", "select_account");
        google.searchParams.set("access_type", "online");

        const headers = new Headers({
          Location: google.toString(),
          "Set-Cookie": stateCookieHeader(encodeOauthCookie(oauth)),
        });
        // Keep users on the production host so the Google callback matches.
        if (url.origin !== CANONICAL_VERCEL_ORIGIN && url.hostname.endsWith(".vercel.app")) {
          headers.set("Referrer-Policy", "no-referrer");
        }
        return new Response(null, { status: 302, headers });
      },
    },
  },
});
