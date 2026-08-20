import { CalendarPlus } from "lucide-react";
import type { Game } from "@/data/site";
import { GAMES } from "@/data/site";
import { downloadIcs, gamesToIcs } from "@/lib/ics";
import { Button } from "@/components/ui/button";

export function AddToCal({
  game,
  all = false,
  variant = "outline",
  size = "default",
}: {
  game?: Game;
  all?: boolean;
  variant?: "outline" | "gold" | "cream";
  size?: "sm" | "default" | "lg";
}) {
  function onClick() {
    if (all) {
      downloadIcs(
        "tailgate-tribe-2026.ics",
        gamesToIcs(GAMES.filter((g) => g.tribeEvent)),
      );
      return;
    }
    if (game) {
      downloadIcs(
        `tailgate-tribe-${game.id}.ics`,
        gamesToIcs([game], `Tribe vs ${game.nickname ?? game.opponent}`),
      );
    }
  }

  return (
    <Button type="button" variant={variant} size={size} onClick={onClick}>
      <CalendarPlus className="size-4" />
      {all ? "Add season to calendar" : "Add to calendar"}
    </Button>
  );
}
