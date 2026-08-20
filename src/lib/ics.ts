import type { Game } from "@/data/site";
import { SITE } from "@/data/site";

const NY = "America/New_York";

function nyParts(iso: string) {
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: NY,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(fmt.formatToParts(d).map((p) => [p.type, p.value]));
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
  };
}

function stamp(iso: string) {
  const p = nyParts(iso);
  return `${p.year}${p.month}${p.day}T${p.hour}${p.minute}00`;
}

function dayStamp(date: string) {
  return date.replaceAll("-", "");
}

function nextDay(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + 1));
  return dt.toISOString().slice(0, 10).replaceAll("-", "");
}


function fold(line: string) {
  return line.replace(/\n/g, "\\n");
}

function eventBlock(game: Game) {
  const title = `Tailgate Tribe vs ${game.nickname ?? game.opponent}`;
  const desc = [
    game.tailgateLabel,
    game.kickoffLabel,
    game.tv,
    game.note,
    "East of Lot 8 — inflatable tent. Independent fan gathering.",
  ]
    .filter(Boolean)
    .join(" · ");
  const loc = game.home
    ? `${SITE.location.street}, ${SITE.location.city}`
    : game.venue;
  const geo = game.home
    ? `\nGEO:${SITE.location.lat};${SITE.location.lng}`
    : "";

  let timing: string;
  if (game.tailgateStart) {
    const end = game.kickoff ?? game.tailgateStart;
    timing = `DTSTART;TZID=America/New_York:${stamp(game.tailgateStart)}\nDTEND;TZID=America/New_York:${stamp(end)}`;
  } else {
    timing = `DTSTART;VALUE=DATE:${dayStamp(game.date)}\nDTEND;VALUE=DATE:${nextDay(game.date)}`;
  }

  return `BEGIN:VEVENT
UID:${game.id}-2026@tailgatetribe.com
${timing}
SUMMARY:${fold(title)}
DESCRIPTION:${fold(desc)}
LOCATION:${fold(loc)}${geo}
END:VEVENT`;
}

export function gamesToIcs(games: Game[], calName = "Tailgate Tribe 2026") {
  const body = games.map(eventBlock).join("\n");
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Tailgate Tribe//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${calName}
X-WR-TIMEZONE:America/New_York
${body}
END:VCALENDAR
`.replaceAll("\n", "\r\n");
}

export function downloadIcs(filename: string, ics: string) {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
