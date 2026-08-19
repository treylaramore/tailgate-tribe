import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { getEvent } from "@/lib/events";

export type RsvpSummary = { eventId: string; heads: number; parties: number };
export type RsvpRow = {
  eventId: string;
  displayName: string;
  partySize: number;
  bringing: string;
};

export const listRsvpSummaries = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{ event_id: string; heads: number; parties: number }>`
    select event_id, coalesce(sum(party_size), 0)::int as heads, count(*)::int as parties
    from rsvps
    group by event_id
  `;
  return rows.map((row) => ({
    eventId: row.event_id,
    heads: Number(row.heads),
    parties: Number(row.parties),
  })) satisfies RsvpSummary[];
});

export const listEventRsvps = createServerFn({ method: "GET" })
  .validator((eventId: string) => eventId)
  .handler(async ({ data: eventId }) => {
    const sql = await getSql();
    const rows = await sql<{ display_name: string; party_size: number; bringing: string }>`
      select display_name, party_size, bringing from rsvps where event_id = ${eventId} order by created_at
    `;
    return rows.map((row) => ({
      displayName: row.display_name,
      partySize: Number(row.party_size),
      bringing: row.bringing,
    }));
  });

export const listMyRsvps = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      event_id: string;
      display_name: string;
      party_size: number;
      bringing: string;
    }>`
      select event_id, display_name, party_size, bringing from rsvps where user_id = ${context.userId}
    `;
    return rows.map((row) => ({
      eventId: row.event_id,
      displayName: row.display_name,
      partySize: Number(row.party_size),
      bringing: row.bringing,
    })) satisfies RsvpRow[];
  });

export const saveRsvp = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { eventId: string; displayName: string; partySize: number; bringing: string }) => data)
  .handler(async ({ context, data }) => {
    const event = getEvent(data.eventId);
    if (!event?.hasTribe) throw new Error("No Tribe tent this week");
    const displayName = data.displayName.trim().slice(0, 40);
    if (!displayName) throw new Error("Need a name");
    const partySize = Math.min(12, Math.max(1, Math.round(Number(data.partySize) || 1)));
    const bringing = data.bringing.trim().slice(0, 80);
    const sql = await getSql();
    await sql`
      insert into rsvps (user_id, event_id, display_name, party_size, bringing, updated_at)
      values (${context.userId}, ${data.eventId}, ${displayName}, ${partySize}, ${bringing}, now())
      on conflict (user_id, event_id) do update
        set display_name = excluded.display_name,
            party_size = excluded.party_size,
            bringing = excluded.bringing,
            updated_at = now()
    `;
    return { ok: true };
  });

export const cancelRsvp = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((eventId: string) => eventId)
  .handler(async ({ context, data: eventId }) => {
    const sql = await getSql();
    await sql`delete from rsvps where user_id = ${context.userId} and event_id = ${eventId}`;
    return { ok: true };
  });
