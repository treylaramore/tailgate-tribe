/**
 * Optional overrides for a personal Vercel deploy that does not get
 * platform-injected DATABASE_URL / BETTER_AUTH_SECRET.
 *
 * Preview (no VERCEL env) ignores this file and keeps using PGLite.
 * Leave both undefined in git — production uploads may fill them.
 */
export const vercelDatabaseUrl: string | undefined = undefined;
export const vercelAuthSecret: string | undefined = undefined;
