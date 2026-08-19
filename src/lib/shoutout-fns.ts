import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

export type Shoutout = { id: number; displayName: string; message: string };

export const listShoutouts = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{ id: number; display_name: string; message: string }>`
    select id, display_name, message from shoutouts order by created_at desc limit 40
  `;
  return rows.map((row) => ({
    id: Number(row.id),
    displayName: row.display_name,
    message: row.message,
  })) satisfies Shoutout[];
});

export const postShoutout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { displayName: string; message: string }) => data)
  .handler(async ({ context, data }) => {
    const displayName = data.displayName.trim().slice(0, 40);
    const message = data.message.trim().slice(0, 180);
    if (!displayName || !message) throw new Error("Need a name and a shout");
    const sql = await getSql();
    await sql`
      insert into shoutouts (user_id, display_name, message)
      values (${context.userId}, ${displayName}, ${message})
    `;
    return { ok: true };
  });
