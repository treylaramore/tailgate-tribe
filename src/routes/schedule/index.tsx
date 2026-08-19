import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { GameCard } from "@/components/game-card";
import { SiteShell } from "@/components/site-chrome";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/cn";
import { EVENTS } from "@/lib/events";
import { listMyRsvps, listRsvpSummaries } from "@/lib/rsvp-fns";

export const Route = createFileRoute("/schedule/")({ component: SchedulePage });

const FILTERS = [
  { id: "tribe", label: "Tribe tent" },
  { id: "home", label: "Home" },
  { id: "all", label: "Full slate" },
] as const;

function SchedulePage() {
  const { user, isPending } = useCurrentUserState();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("tribe");
  const [summaries, setSummaries] = useState<Record<string, { heads: number; parties: number }>>({});
  const [mine, setMine] = useState<string[]>([]);

  useEffect(() => {
    listRsvpSummaries()
      .then((rows) => setSummaries(Object.fromEntries(rows.map((row) => [row.eventId, row]))))
      .catch(() => setSummaries({}));
  }, []);

  useEffect(() => {
    if (isPending || !user) {
      setMine([]);
      return;
    }
    listMyRsvps()
      .then((rows) => setMine(rows.map((row) => row.eventId)))
      .catch(() => setMine([]));
  }, [user, isPending]);

  const events = useMemo(() => {
    if (filter === "tribe") return EVENTS.filter((event) => event.hasTribe);
    if (filter === "home") return EVENTS.filter((event) => event.home);
    return EVENTS;
  }, [filter]);

  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <p className="font-display text-xs tracking-[0.28em] text-gold">2026 FOOTBALL</p>
        <h1 className="mt-3 font-display text-5xl uppercase sm:text-6xl">The slate</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Tribe sets a tent at every home game — plus a road meet-up for Alabama. Kickoff times fill in as TV announces them.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "h-11 px-4 font-display text-xs tracking-[0.16em] uppercase",
                filter === item.id ? "bg-gold text-night" : "text-cream shadow-[0_0_0_1px_rgba(243,230,200,0.2)]",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <GameCard key={event.id} event={event} summary={summaries[event.id]} mine={mine.includes(event.id)} />
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
