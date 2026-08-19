import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { kickoffLabel, tentLabel, type TribeEvent } from "@/lib/events";
import { useSite } from "@/lib/site-provider";

export function GameCard({
  event,
  summary,
  mine,
}: {
  event: TribeEvent;
  summary?: { heads: number; parties: number };
  mine?: boolean;
}) {
  const { text } = useSite();
  const verb = text("tribe_verb") || "chanting";
  return (
    <Link to="/schedule/$eventId" params={{ eventId: event.id }} className="program-card group flex flex-col bg-ink p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-xs tracking-[0.2em] text-gold">
            {event.weekday.toUpperCase()} · {event.date.toUpperCase()}
          </p>
          <h3 className="mt-2 font-display text-3xl uppercase text-cream group-hover:text-gold-soft">{event.opponent}</h3>
          {event.nickname ? <p className="mt-1 text-sm text-muted">{event.nickname}</p> : null}
        </div>
        <span
          className={cn(
            "shrink-0 px-2 py-1 font-display text-[10px] tracking-[0.16em] uppercase",
            event.home ? "bg-garnet text-cream" : "bg-night text-gold shadow-[0_0_0_1px_rgba(201,162,74,0.45)]",
          )}
        >
          {event.home ? "Home" : "Away"}
        </span>
      </div>
      <div className="mt-4 space-y-1 text-sm text-muted">
        <p>{kickoffLabel(event)}</p>
        <p className={event.hasTribe ? "text-gold" : ""}>{tentLabel(event)}</p>
      </div>
      {event.trophy ? (
        <p className="mt-3 text-[11px] tracking-[0.16em] text-gold uppercase">{event.trophy}</p>
      ) : null}
      <div className="mt-auto flex items-center justify-between pt-5">
        <p className="text-xs text-muted">
          {event.hasTribe ? `${summary?.heads ?? 0} ${verb}${mine ? " · you're in" : ""}` : "No tent"}
        </p>
        <ArrowRight className="size-4 text-gold transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
