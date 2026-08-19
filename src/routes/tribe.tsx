import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RsvpPanel } from "@/components/rsvp-panel";
import { ShoutoutWall } from "@/components/shoutout-wall";
import { SiteShell } from "@/components/site-chrome";
import { cn } from "@/lib/cn";
import { EVENTS, nextTribeEvent } from "@/lib/events";
import { listRsvpSummaries } from "@/lib/rsvp-fns";
import { useSite } from "@/lib/site-provider";

export const Route = createFileRoute("/tribe")({ component: TribePage });

function TribePage() {
  const { text } = useSite();
  const upcoming = nextTribeEvent();
  const [selected, setSelected] = useState(upcoming?.id ?? EVENTS.find((event) => event.hasTribe)?.id ?? "nmsu");
  const [summaries, setSummaries] = useState<Record<string, { heads: number; parties: number }>>({});

  useEffect(() => {
    listRsvpSummaries()
      .then((rows) => setSummaries(Object.fromEntries(rows.map((row) => [row.eventId, row]))))
      .catch(() => setSummaries({}));
  }, []);

  const event = EVENTS.find((item) => item.id === selected) ?? upcoming;
  const tribeDates = EVENTS.filter((item) => item.hasTribe);
  const pledged = Object.values(summaries).reduce((sum, row) => sum + row.heads, 0);

  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <p className="font-display text-xs tracking-[0.28em] text-gold">{text("tribe_kicker")}</p>
        <h1 className="mt-3 font-display text-5xl uppercase sm:text-6xl">{text("tribe_title")}</h1>
        <p className="mt-4 max-w-2xl text-muted">{text("tribe_body")}</p>
        <p className="mt-6 font-display text-2xl uppercase text-gold">{pledged} heads pledged this season</p>
        <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-2xl uppercase">Pick a tent date</h2>
            <ul className="mt-4 space-y-2">
              {tribeDates.map((item) => {
                const active = item.id === selected;
                const heads = summaries[item.id]?.heads ?? 0;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(item.id)}
                      className={cn(
                        "flex min-h-14 w-full items-center justify-between gap-3 px-3 text-left",
                        active
                          ? "bg-garnet text-cream"
                          : "bg-ink text-cream shadow-[0_0_0_1px_rgba(243,230,200,0.08)] hover:shadow-[0_0_0_1px_rgba(201,162,74,0.45)]",
                      )}
                    >
                      <span>
                        <span className="block font-display text-lg uppercase">{item.opponent}</span>
                        <span className="text-xs text-cream/70">
                          {item.date}
                          {item.home ? "" : " · away"}
                        </span>
                      </span>
                      <span className="font-display text-sm text-gold">{heads}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="bg-ink p-5 shadow-[0_0_0_1px_rgba(243,230,200,0.08)] sm:p-6">
            {event ? (
              <>
                <div className="mb-6 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-display text-xs tracking-[0.2em] text-gold">RSVP</p>
                    <h2 className="mt-1 font-display text-3xl uppercase">{event.opponent}</h2>
                  </div>
                  <Link
                    to="/schedule/$eventId"
                    params={{ eventId: event.id }}
                    className="text-sm text-gold hover:text-gold-soft"
                  >
                    Game page
                  </Link>
                </div>
                <RsvpPanel event={event} />
              </>
            ) : null}
          </div>
        </div>
        <section className="mt-16">
          <h2 className="font-display text-3xl uppercase">Shoutouts</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Predictions, ride-share notes, “saving you a seat.” Keep it family-friendly.
          </p>
          <div className="mt-6 max-w-2xl">
            <ShoutoutWall />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
