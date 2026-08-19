/**
 * Optional overrides for a personal Vercel deploy that does not get
 * platform-injected DATABASE_URL / BETTER_AUTH_SECRET / Google OAuth.
 *
 * Preview (no VERCEL env) ignores this file and keeps using PGLite.
 * Leave these undefined in git — production may fill them, or set them
 * from The Booth.
 */
export const vercelDatabaseUrl: string | undefined = undefined;
export const vercelAuthSecret: string | undefined = undefined;
export const vercelGoogleClientId: string | undefined = undefined;
export const vercelGoogleClientSecret: string | undefined = undefined;
