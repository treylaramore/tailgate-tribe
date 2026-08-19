import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { DEFAULT_COPY, IMAGE_SLOTS } from "@/lib/site-content";

function decodeDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image data");
  return { mime: match[1], base64: match[2] };
}

async function requireEditor(userId: string) {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const session = await getSessionUser();
  const email = session?.email?.toLowerCase() ?? null;
  const sql = await getSql();
  const editors = await sql<{ email: string }>`select email from site_editors`;
  if (editors.length === 0) {
    if (email) {
      await sql`insert into site_editors (email) values (${email}) on conflict do nothing`;
    }
    return { email };
  }
  if (!email || !editors.some((row) => row.email === email)) {
    throw new Error("Editors only");
  }
  return { email };
}

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sql = await getSql();
    const copyRows = await sql<{ key: string; value: string }>`select key, value from site_copy`;
    const imageRows = await sql<{ slot: string; version: string }>`select slot, version from site_images`;
    const copy = { ...DEFAULT_COPY };
    for (const row of copyRows) copy[row.key] = row.value;
    const images: Record<string, string> = {};
    for (const row of imageRows) images[row.slot] = row.version;
    return { copy, images };
  } catch {
    return { copy: DEFAULT_COPY, images: {} as Record<string, string> };
  }
});

export const getEditorStatus = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const session = await getSessionUser();
    const email = session?.email ?? null;
    const sql = await getSql();
    const editors = await sql<{ email: string }>`select email from site_editors`;
    const editor =
      editors.length === 0 || Boolean(email && editors.some((row) => row.email === email.toLowerCase()));
    return { editor, email };
  });

export const saveCopy = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: Record<string, string>) => data)
  .handler(async ({ context, data }) => {
    await requireEditor(context.userId);
    const sql = await getSql();
    for (const [key, value] of Object.entries(data)) {
      if (typeof value !== "string") continue;
      await sql`
        insert into site_copy (key, value, updated_at)
        values (${key}, ${value}, now())
        on conflict (key) do update set value = excluded.value, updated_at = now()
      `;
    }
    return { ok: true };
  });

export const saveImage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { slot: string; mime: string; data: string }) => data)
  .handler(async ({ context, data }) => {
    await requireEditor(context.userId);
    if (!IMAGE_SLOTS.some((slot) => slot.id === data.slot)) throw new Error("Unknown photo slot");
    const { mime, base64 } = decodeDataUrl(data.data);
    const sql = await getSql();
    const version = `${Date.now()}`;
    await sql`
      insert into site_images (slot, mime, data, version, updated_at)
      values (${data.slot}, ${mime}, ${base64}, ${version}, now())
      on conflict (slot) do update set mime = excluded.mime, data = excluded.data, version = excluded.version, updated_at = now()
    `;
    return { ok: true, version };
  });

export const restoreImage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((slot: string) => slot)
  .handler(async ({ context, data: slot }) => {
    await requireEditor(context.userId);
    const sql = await getSql();
    await sql`delete from site_images where slot = ${slot}`;
    return { ok: true };
  });

export const addEditor = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((email: string) => email.trim().toLowerCase())
  .handler(async ({ context, data: email }) => {
    await requireEditor(context.userId);
    if (!email.includes("@")) throw new Error("Need a real email");
    const sql = await getSql();
    await sql`insert into site_editors (email) values (${email}) on conflict do nothing`;
    return { ok: true };
  });

export const listEditors = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireEditor(context.userId);
    const sql = await getSql();
    const rows = await sql<{ email: string }>`select email from site_editors order by email`;
    return rows.map((row) => row.email);
  });

export const getImageRecord = createServerFn({ method: "GET" })
  .validator((slot: string) => slot)
  .handler(async ({ data: slot }) => {
    const sql = await getSql();
    const rows = await sql<{ mime: string; data: string }>`
      select mime, data from site_images where slot = ${slot} limit 1
    `;
    return rows[0] ?? null;
  });

export const getGoogleAuthStatus = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireEditor(context.userId);
    const { getGoogleSettingsPublic, googleCallbackUrl } = await import("@/lib/auth/google-oauth.server");
    const status = await getGoogleSettingsPublic();
    return { ...status, callbackUrl: googleCallbackUrl() };
  });

export const saveGoogleAuthSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { clientId: string; clientSecret: string }) => data)
  .handler(async ({ context, data }) => {
    await requireEditor(context.userId);
    const { saveGoogleSettings } = await import("@/lib/auth/google-oauth.server");
    await saveGoogleSettings(data);
    return { ok: true };
  });
