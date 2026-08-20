import { Link } from "@tanstack/react-router";
import { GAMES } from "@/data/site";
import { monthDay, nextTribeGame, statusOf } from "@/lib/schedule";
import { cn } from "@/lib/utils";

export function SeasonStrip() {
  const next = nextTribeGame();
  const tribe = GAMES.filter((g) => g.tribeEvent);

  return (
    <div className="overflow-x-hidden border-y border-border bg-garnet-deep [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 px-4 py-3 md:flex-nowrap md:px-6">
        <p className="kicker shrink-0 whitespace-nowrap text-gold">2026 tent dates</p>
        <ul className="flex min-w-0 flex-wrap items-center justify-center gap-1.5 md:flex-nowrap">
          {tribe.map((game) => {
            const { month, day } = monthDay(game.date);
            const status = statusOf(game);
            const isNext = game.id === next?.id;
            return (
              <li key={game.id} className="shrink-0">
                <Link
                  to="/schedule"
                  className={cn(
                    "flex min-h-10 items-center gap-1.5 rounded-full border px-2.5 py-1.5 whitespace-nowrap transition-colors duration-150",
                    isNext
                      ? "border-gold bg-gold text-ink"
                      : status === "past"
                        ? "border-border text-muted"
                        : "border-border text-cream hover:border-gold hover:text-gold",
                  )}
                >
                  <span className="font-display text-[0.7rem] tracking-wider uppercase">
                    {month} {day}
                  </span>
                  <span className="text-sm font-medium">{game.short}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
