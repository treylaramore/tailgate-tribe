import { GAMES, type Game } from "@/data/site";

export type EventStatus = "upcoming" | "live" | "past";

const NY = "America/New_York";

export function parseStamp(iso?: string) {
  return iso ? new Date(iso) : null;
}

export function gameInstant(game: Game) {
  return parseStamp(game.tailgateStart) ?? parseStamp(game.kickoff);
}

export function statusOf(game: Game, now = new Date()): EventStatus {
  const start = parseStamp(game.tailgateStart) ?? parseStamp(game.kickoff);
  const kick = parseStamp(game.kickoff);
  if (!start) {
    const dayEnd = new Date(`${game.date}T23:59:59-05:00`);
    return now > dayEnd ? "past" : "upcoming";
  }
  const end = kick
    ? new Date(kick.getTime() + 4 * 60 * 60 * 1000)
    : new Date(start.getTime() + 10 * 60 * 60 * 1000);
  if (now < start) return "upcoming";
  if (now <= end) return "live";
  return "past";
}

export function tribeGames() {
  return GAMES.filter((g) => g.tribeEvent);
}

export function nextTribeGame(now = new Date()) {
  const upcoming = tribeGames()
    .map((game) => ({ game, status: statusOf(game, now) }))
    .filter(({ status }) => status !== "past");
  const live = upcoming.find(({ status }) => status === "live");
  return (live ?? upcoming[0])?.game ?? null;
}

export function formatGameDate(date: string) {
  const d = new Date(`${date}T12:00:00-04:00`);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: NY,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatLongDate(date: string) {
  const d = new Date(`${date}T12:00:00-04:00`);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: NY,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function monthDay(date: string) {
  const d = new Date(`${date}T12:00:00-04:00`);
  return {
    month: new Intl.DateTimeFormat("en-US", { timeZone: NY, month: "short" })
      .format(d)
      .toUpperCase(),
    day: new Intl.DateTimeFormat("en-US", { timeZone: NY, day: "2-digit" }).format(d),
  };
}

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

export function diffCountdown(target: Date, now = new Date()): Countdown {
  const total = Math.max(0, target.getTime() - now.getTime());
  const seconds = Math.floor(total / 1000);
  return {
    total,
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

export function pad2(n: number) {
  return n.toString().padStart(2, "0");
}
