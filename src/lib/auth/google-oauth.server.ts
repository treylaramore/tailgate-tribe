/**
 * Direct Google OAuth for personal Vercel deploys.
 *
 * The Grok broker's shared preview client only allows
 * `*.grok-sandbox.com` callbacks. A copy on `*.vercel.app` therefore
 * gets `{"message":"Invalid redirect URI"}` after Google. This path
 * talks to Google itself and then writes a Better Auth session.
 */
import { createHmac, randomBytes } from "node:crypto";
import { auth, SESSION_TOKEN_COOKIE } from "@/lib/auth/server";
import { getSql } from "@/lib/db";
import { vercelGoogleClientId, vercelGoogleClientSecret } from "@/lib/deploy-secrets.server";

export const CANONICAL_VERCEL_ORIGIN = "https://tailgate-tribe.vercel.app";
export const GOOGLE_CALLBACK_PATH = "/api/auth/google/callback";
const STATE_COOKIE = "tt_google_oauth";
const SETTINGS_ID = "google_client_id";
const SETTINGS_SECRET = "google_client_secret";

function env(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function googleCallbackUrl(): string {
  return `${CANONICAL_VERCEL_ORIGIN}${GOOGLE_CALLBACK_PATH}`;
}

export async function getGoogleCredentials(): Promise<{ clientId: string; clientSecret: string } | null> {
  const fromEnvId = env("GOOGLE_CLIENT_ID") ?? vercelGoogleClientId;
  const fromEnvSecret = env("GOOGLE_CLIENT_SECRET") ?? vercelGoogleClientSecret;
  if (fromEnvId && fromEnvSecret) return { clientId: fromEnvId, clientSecret: fromEnvSecret };

  try {
    const sql = await getSql();
    const rows = await sql<{ key: string; value: string }>`
      select key, value from auth_settings where key in (${SETTINGS_ID}, ${SETTINGS_SECRET})
    `;
    const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));
    const clientId = map[SETTINGS_ID]?.trim();
    const clientSecret = map[SETTINGS_SECRET]?.trim();
    if (clientId && clientSecret) return { clientId, clientSecret };
  } catch {
    /* table missing on first boot */
  }
  return null;
}

export async function getGoogleSettingsPublic(): Promise<{ configured: boolean; clientIdTail: string }> {
  const creds = await getGoogleCredentials();
  if (!creds) return { configured: false, clientIdTail: "" };
  const tail = creds.clientId.length > 12 ? creds.clientId.slice(-12) : creds.clientId;
  return { configured: true, clientIdTail: tail };
}

export async function saveGoogleSettings(input: { clientId: string; clientSecret: string }): Promise<void> {
  const clientId = input.clientId.trim();
  const clientSecret = input.clientSecret.trim();
  if (!clientId || !clientSecret) throw new Error("Need both the Google client ID and secret");
  const sql = await getSql();
  await sql`
    insert into auth_settings (key, value, updated_at) values (${SETTINGS_ID}, ${clientId}, now())
    on conflict (key) do update set value = excluded.value, updated_at = now()
  `;
  await sql`
    insert into auth_settings (key, value, updated_at) values (${SETTINGS_SECRET}, ${clientSecret}, now())
    on conflict (key) do update set value = excluded.value, updated_at = now()
  `;
}

function signingKey(): string {
  return env("BETTER_AUTH_SECRET") ?? "tailgate-tribe-google-oauth";
}

function sign(payload: string): string {
  return createHmac("sha256", signingKey()).update(payload).digest("base64url");
}

export type OauthState = { state: string; verifier: string; redirect: string };

export function encodeOauthCookie(data: OauthState): string {
  const payload = Buffer.from(JSON.stringify(data), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeOauthCookie(raw: string | undefined): OauthState | null {
  if (!raw) return null;
  const dot = raw.lastIndexOf(".");
  if (dot < 1) return null;
  const payload = raw.slice(0, dot);
  const mac = raw.slice(dot + 1);
  if (sign(payload) !== mac) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as OauthState;
    if (!parsed.state || !parsed.verifier) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

export function newOauthState(redirect: string): OauthState {
  return {
    state: randomBytes(16).toString("base64url"),
    verifier: randomBytes(32).toString("base64url"),
    redirect: sanitizeRedirect(redirect),
  };
}

export function sanitizeRedirect(value?: string | null): string {
  if (!value) return "/tribe";
  if (!value.startsWith("/") || value.startsWith("//")) return "/tribe";
  return value;
}

function b64url(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString("base64url");
}

export async function challengeS256(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return b64url(digest);
}

export function stateCookieHeader(value: string | null): string {
  const base = `${STATE_COOKIE}=`;
  if (!value) {
    return `${base}deleted; Path=${GOOGLE_CALLBACK_PATH}; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
  }
  return `${base}${encodeURIComponent(value)}; Path=${GOOGLE_CALLBACK_PATH}; Max-Age=600; HttpOnly; Secure; SameSite=Lax`;
}

export function sessionCookieHeader(token: string, maxAgeSec: number): string {
  return `${SESSION_TOKEN_COOKIE}=${token}; Path=/; Max-Age=${maxAgeSec}; HttpOnly; Secure; SameSite=Lax`;
}

export async function createAppSession(profile: {
  email: string;
  name: string;
  image?: string | null;
  googleId: string;
}): Promise<string> {
  const email = profile.email.trim().toLowerCase();
  if (!email.includes("@")) throw new Error("Google did not return an email");
  const name = profile.name.trim().slice(0, 80) || email.split("@")[0] || "Tribe member";
  const image = profile.image ?? null;
  const now = new Date();
  const ctx = await auth.$context;
  const existing = await ctx.internalAdapter.findUserByEmail(email);
  let userId = existing?.user.id;
  if (!userId) {
    const created = await ctx.internalAdapter.createUser({
      email,
      name,
      emailVerified: true,
      image,
    });
    userId = created.id;
  } else if (image && !existing?.user.image) {
    await ctx.internalAdapter.updateUser(userId, { image, name });
  }

  const accounts = await ctx.internalAdapter.findAccounts(userId);
  const linked = accounts.some((account) => account.providerId === "google" && account.accountId === profile.googleId);
  if (!linked) {
    await ctx.internalAdapter.createAccount({
      userId,
      providerId: "google",
      accountId: profile.googleId,
      accessToken: null,
      refreshToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: "openid email profile",
      password: null,
    });
  }

  const session = await ctx.internalAdapter.createSession(userId, false);
  if (!session?.token) throw new Error("Could not start a session");
  void now;
  return session.token;
}
