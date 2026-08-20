import { useEffect, useState } from "react";
import type { Game } from "@/data/site";
import { diffCountdown, pad2, parseStamp, statusOf } from "@/lib/schedule";
import { cn } from "@/lib/utils";

function useNow(interval = 1000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), interval);
    return () => window.clearInterval(id);
  }, [interval]);
  return now;
}

const CELLS = ["Days", "Hrs", "Min", "Sec"] as const;

function Cells({
  values,
  compact,
}: {
  values: string[];
  compact?: boolean;
}) {
  return (
    <>
      {CELLS.map((label, i) => (
        <div
          key={label}
          className={cn(
            "min-w-16 rounded-lg border border-border bg-ink/50 px-3 py-2 text-center sm:min-w-20",
            compact && "min-w-14 px-2 py-1.5",
          )}
        >
          <div
            className={cn(
              "font-display tabular-nums text-4xl leading-none text-gold sm:text-5xl",
              compact && "text-3xl sm:text-4xl",
            )}
          >
            {values[i]}
          </div>
          <div className="mt-1 font-display text-kicker tracking-kicker text-muted uppercase">
            {label}
          </div>
        </div>
      ))}
    </>
  );
}

export function Countdown({
  game,
  className,
  compact = false,
}: {
  game: Game;
  className?: string;
  compact?: boolean;
}) {
  const now = useNow();
  const target = parseStamp(game.tailgateStart) ?? parseStamp(game.kickoff);

  if (!target) {
    return (
      <p className={cn("font-display text-2xl uppercase tracking-wide text-gold", className)}>
        Time TBA — watch the group
      </p>
    );
  }

  if (now && statusOf(game, now) === "live") {
    return (
      <p className={cn("font-display text-3xl uppercase tracking-wide text-gold", className)}>
        The tent is up. Come find us.
      </p>
    );
  }

  if (now && statusOf(game, now) === "past") {
    return (
      <p className={cn("font-display text-2xl uppercase tracking-wide text-muted", className)}>
        This one is in the books.
      </p>
    );
  }

  const t = now ? diffCountdown(target, now) : null;
  const values = t
    ? [pad2(t.days), pad2(t.hours), pad2(t.minutes), pad2(t.seconds)]
    : ["--", "--", "--", "--"];

  return (
    <div
      className={cn("flex flex-wrap gap-3 sm:gap-4", className)}
      aria-live="polite"
      aria-label={`Countdown to ${game.opponent} tailgate`}
    >
      <Cells values={values} compact={compact} />
    </div>
  );
}
