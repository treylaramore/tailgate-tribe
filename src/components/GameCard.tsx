import { ExternalLink, MapPin } from "lucide-react";
import type { Game } from "@/data/site";
import { SITE } from "@/data/site";
import { formatGameDate, monthDay, statusOf } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddToCal } from "@/components/AddToCal";

export function GameCard({
  game,
  featured = false,
}: {
  game: Game;
  featured?: boolean;
}) {
  const { month, day } = monthDay(game.date);
  const status = statusOf(game);
  const title = game.nickname ?? game.opponent;

  return (
    <article
      className={cn(
        "flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 shadow-lift sm:flex-row sm:items-stretch sm:p-6",
        featured && "border-gold/50 bg-surface-2",
        status === "past" && "opacity-70",
      )}
    >
      <div className="flex shrink-0 flex-row items-center gap-4 sm:w-24 sm:flex-col sm:justify-center sm:gap-0 sm:border-r sm:border-border sm:pr-5">
        <p className="font-display text-kicker tracking-kicker text-gold">{month}</p>
        <p className="font-display text-5xl leading-none text-cream">{day}</p>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {status === "live" && <Badge tone="live">Happening now</Badge>}
          {status === "upcoming" && featured && <Badge>Next up</Badge>}
          {game.tribeEvent ? (
            <Badge tone="garnet">Tribe tent</Badge>
          ) : (
            <Badge tone="muted">Road game</Badge>
          )}
          {game.home ? (
            <Badge tone="muted">Home</Badge>
          ) : (
            <Badge tone="muted">Away</Badge>
          )}
        </div>
        <div>
          <h3 className="font-display text-3xl uppercase text-cream sm:text-4xl">{title}</h3>
          {game.nickname ? (
            <p className="mt-1 text-sm text-muted">vs {game.opponent}</p>
          ) : null}
        </div>
        <p className="text-sm text-muted">
          {formatGameDate(game.date)}
          {game.note ? ` · ${game.note}` : ""}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-cream/90">
          {game.tailgateLabel && <span>{game.tailgateLabel}</span>}
          <span>{game.kickoffLabel}</span>
          {game.tv && <span>{game.tv}</span>}
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="size-3.5 shrink-0 text-gold" />
          {game.tribeEvent && game.home ? SITE.location.label : game.venue}
        </p>
      </div>
      <div className="flex shrink-0 flex-col justify-center gap-2 sm:w-48">
        {game.facebookUrl ? (
          <Button asChild>
            <a href={game.facebookUrl} target="_blank" rel="noreferrer">
              Event details
              <ExternalLink className="size-3.5" />
            </a>
          </Button>
        ) : game.tribeEvent ? (
          <Button asChild variant="outline">
            <a href={SITE.facebookGroup} target="_blank" rel="noreferrer">
              Ask in the group
            </a>
          </Button>
        ) : (
          <p className="text-sm text-muted">No Tribe tent this week — Noles on the road.</p>
        )}
        {game.tribeEvent ? <AddToCal game={game} size="sm" /> : null}
      </div>
    </article>
  );
}
