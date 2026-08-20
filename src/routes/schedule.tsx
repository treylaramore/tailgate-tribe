import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BYES, GAMES, SITE } from "@/data/site";
import { formatLongDate, monthDay, nextTribeGame } from "@/lib/schedule";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/Countdown";
import { GameCard } from "@/components/GameCard";
import { AddToCal } from "@/components/AddToCal";
import { WeatherChip } from "@/components/WeatherChip";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [{ title: "2026 Schedule · Tailgate Tribe" }],
  }),
  component: SchedulePage,
});

type Filter = "tribe" | "home" | "all";

function SchedulePage() {
  const [filter, setFilter] = useState<Filter>("tribe");
  const next = nextTribeGame();
  const games = useMemo(() => {
    if (filter === "tribe") return GAMES.filter((g) => g.tribeEvent);
    if (filter === "home") return GAMES.filter((g) => g.home);
    return GAMES;
  }, [filter]);

  return (
    <main id="main" className="bg-bg pt-24">
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <p className="kicker">{SITE.season} football</p>
        <h1 className="mt-3 font-display text-5xl uppercase text-cream sm:text-7xl">
          The season
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          The Tribe raises the tent for every home game — plus the Alabama road
          gathering. Kickoff times lock in as the conference announces them.
        </p>
        {next ? (
          <div className="mt-8 rounded-2xl border border-gold/40 bg-surface p-5 sm:p-6">
            <p className="kicker">Counting down</p>
            <p className="mt-2 font-display text-3xl uppercase text-cream">
              vs {next.nickname ?? next.opponent}
            </p>
            <p className="mt-1 text-muted">
              {formatLongDate(next.date)}
              {next.tailgateLabel ? ` · ${next.tailgateLabel}` : ""}
              {` · ${next.kickoffLabel}`}
            </p>
            <Countdown game={next} className="mt-4" compact />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <WeatherChip date={next.date} />
              <AddToCal game={next} size="sm" />
              <AddToCal all size="sm" />
            </div>
          </div>
        ) : null}
        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Schedule filter">
          {(
            [
              ["tribe", "Tribe dates"],
              ["home", "Home games"],
              ["all", "Full slate"],
            ] as const
          ).map(([id, label]) => (
            <Button
              key={id}
              size="sm"
              variant={filter === id ? "gold" : "outline"}
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
            >
              {label}
            </Button>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl space-y-4 px-4 pb-10 sm:px-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} featured={game.id === next?.id} />
        ))}
      </section>
      {filter === "all" ? (
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <p className="kicker">Open dates</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {BYES.map((bye) => {
              const { month, day } = monthDay(bye.date);
              return (
                <li
                  key={bye.id}
                  className="rounded-2xl border border-border bg-surface px-5 py-4"
                >
                  <p className="font-display text-gold">
                    {month} {day}
                  </p>
                  <p className="text-muted">{bye.label}</p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <div className="h-16" />
      )}
    </main>
  );
}
