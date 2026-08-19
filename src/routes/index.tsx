import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, MapPin, Shield, Tent, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { GameCard } from "@/components/game-card";
import { RsvpPanel } from "@/components/rsvp-panel";
import { ShoutoutWall } from "@/components/shoutout-wall";
import { SiteShell } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { EVENTS, FACEBOOK_GROUP, kickoffLabel, nextTribeEvent, tentLabel, type TribeEvent } from "@/lib/events";
import { listRsvpSummaries } from "@/lib/rsvp-fns";
import { SiteImage, useSite } from "@/lib/site-provider";

export const Route = createFileRoute("/")({ component: Home });

const PACK = [
  { id: "chair", label: "Tailgate chair" },
  { id: "drinks", label: "Your favorite drinks" },
  { id: "sunscreen", label: "Sunscreen + shades" },
  { id: "hat", label: "Hat (the sun is real)" },
  { id: "id", label: "ID if you want a drink" },
  { id: "battery", label: "Phone battery" },
  { id: "kids", label: "Kid kit, if little Noles are coming" },
  { id: "layers", label: "A layer for night kickoffs" },
];
const PACK_KEY = "tribe-pack";

function splitTime(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function Countdown({ event }: { event: TribeEvent }) {
  const [parts, setParts] = useState<ReturnType<typeof splitTime> | null>(null);
  useEffect(() => {
    const tick = () => setParts(splitTime(new Date(event.iso).getTime() - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [event.iso]);
  const live = parts !== null && Object.values(parts).every((value) => value === 0);
  return (
    <div>
      <p className="mb-3 font-display text-xs tracking-[0.28em] text-gold">
        {live ? "TENT IS LIVE" : `NEXT UP · ${event.opponent.toUpperCase()}`}
      </p>
      {live ? (
        <p className="font-display text-3xl uppercase text-cream">We are out there. Come find the tent.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {(["Days", "Hrs", "Min", "Sec"] as const).map((label, index) => {
            const value = [parts?.days, parts?.hours, parts?.minutes, parts?.seconds][index] ?? 0;
            return (
              <div
                key={label}
                className="min-w-16 bg-night/70 px-3 py-3 text-center shadow-[0_0_0_1px_rgba(201,162,74,0.28)]"
              >
                <div className="font-display text-3xl tabular leading-none text-gold sm:text-4xl">
                  {String(value).padStart(2, "0")}
                </div>
                <div className="mt-1.5 text-[10px] tracking-[0.22em] text-muted uppercase">{label}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PackList() {
  const [checked, setChecked] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PACK_KEY);
      if (raw) setChecked(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);
  function toggle(id: string) {
    setChecked((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      try {
        window.localStorage.setItem(PACK_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }
  return (
    <ul className="space-y-2">
      {PACK.map((item) => {
        const on = checked.includes(item.id);
        return (
          <li key={item.id}>
            <button type="button" onClick={() => toggle(item.id)} className="flex min-h-11 w-full items-center gap-3 px-1 text-left">
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center shadow-[0_0_0_1px_rgba(201,162,74,0.55)]",
                  on ? "bg-gold text-night" : "bg-transparent text-transparent",
                )}
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              <span className={cn("text-sm", on ? "text-muted line-through" : "text-cream")}>{item.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Home() {
  const { text } = useSite();
  const next = nextTribeEvent();
  const [summaries, setSummaries] = useState<Record<string, { heads: number; parties: number }>>({});
  useEffect(() => {
    listRsvpSummaries()
      .then((rows) => setSummaries(Object.fromEntries(rows.map((row) => [row.eventId, row]))))
      .catch(() => setSummaries({}));
  }, []);
  const preview = EVENTS.filter((event) => event.hasTribe).slice(0, 4);

  return (
    <SiteShell>
      <section className="relative min-h-[92svh] overflow-hidden">
        <SiteImage
          slot="hero"
          alt="Tailgate Tribe setup at dusk — inflatable sofas, tables, and stadium lights"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/25" />
        <div className="relative mx-auto flex min-h-[92svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6">
          <p className="font-display text-xs tracking-[0.32em] text-gold">{text("hero_kicker")}</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl uppercase leading-[0.9] text-cream sm:text-7xl">
            {text("hero_title")}
            <span className="block text-gold">{text("hero_gold")}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-cream/85 sm:text-lg">{text("hero_body")}</p>
          <div className="mt-8">{next ? <Countdown event={next} /> : null}</div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to={next ? "/schedule/$eventId" : "/schedule"} params={next ? { eventId: next.id } : undefined}>
                {text("cta_primary")}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/location">{text("cta_find")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {next ? (
        <section className="border-y border-gold/15 bg-ink">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="font-display text-xs tracking-[0.28em] text-gold">NEXT TRIBE TAILGATE</p>
              <h2 className="mt-3 font-display text-5xl uppercase text-cream sm:text-6xl">{next.opponent}</h2>
              <p className="mt-3 text-muted">
                {next.weekday} {next.date} · {kickoffLabel(next)} · {tentLabel(next)}
                {next.home ? " · East of Lot 8" : " · Road Tribe"}
              </p>
              {next.note ? <p className="mt-3 max-w-lg text-cream">{next.note}</p> : null}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/schedule/$eventId" params={{ eventId: next.id }}>
                    RSVP this game
                  </Link>
                </Button>
                {next.facebook ? (
                  <Button asChild variant="ghost">
                    <a href={next.facebook} target="_blank" rel="noreferrer">
                      Facebook event
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
            <SiteImage
              slot="tent"
              alt="The Tailgate Tribe inflatable tent with the gold T and spear"
              className="h-72 w-full object-cover object-[center_30%] sm:h-80"
            />
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <p className="font-display text-xs tracking-[0.28em] text-gold">{text("how_kicker")}</p>
        <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">{text("how_title")}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { icon: Tent, title: text("how_1_title"), copy: text("how_1_copy") },
            { icon: Users, title: text("how_2_title"), copy: text("how_2_copy") },
            { icon: Shield, title: text("how_3_title"), copy: text("how_3_copy") },
          ].map((card) => (
            <article key={card.title} className="program-card bg-ink p-6">
              <card.icon className="size-6 text-gold" />
              <h3 className="mt-5 font-display text-2xl uppercase text-cream">{card.title}</h3>
              <p className="mt-3 text-sm text-muted">{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ink">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <SiteImage slot="friends" alt="The crew hanging at the Tribe tailgate" className="h-80 w-full object-cover sm:h-[28rem]" />
          <div>
            <p className="font-display text-xs tracking-[0.28em] text-gold">{text("who_kicker")}</p>
            <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">{text("who_title")}</h2>
            <ul className="mt-6 space-y-3 text-cream">
              {[text("who_1"), text("who_2"), text("who_3"), text("who_4")].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 bg-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8" variant="outline">
              <a href={FACEBOOK_GROUP} target="_blank" rel="noreferrer">
                Join the Facebook crew
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs tracking-[0.28em] text-gold">{text("season_kicker")}</p>
            <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">{text("season_title")}</h2>
          </div>
          <Link
            to="/schedule"
            className="inline-flex items-center gap-2 font-display text-sm tracking-[0.16em] uppercase text-gold hover:text-gold-soft"
          >
            Full slate <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {preview.map((event) => (
            <GameCard key={event.id} event={event} summary={summaries[event.id]} />
          ))}
        </div>
      </section>

      <section className="bg-garnet-deep">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="font-display text-xs tracking-[0.28em] text-gold">{text("find_kicker")}</p>
            <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">{text("find_title")}</h2>
            <p className="mt-4 flex items-start gap-2 text-cream/90">
              <MapPin className="mt-0.5 size-5 shrink-0 text-gold" />
              {text("find_address")}
            </p>
            <Button asChild className="mt-8">
              <Link to="/location">Get directions</Link>
            </Button>
          </div>
          <SiteImage slot="stadium" alt="Night at the lot — chairs, tables, and Doak lights" className="h-72 w-full object-cover" />
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-display text-xs tracking-[0.28em] text-gold">{text("pack_kicker")}</p>
          <h2 className="mt-3 font-display text-4xl uppercase">{text("pack_title")}</h2>
          <p className="mt-4 text-sm text-muted">{text("pack_body")}</p>
          <SiteImage slot="feast" alt="Tables set at the Tribe tailgate" className="mt-6 h-52 w-full object-cover" />
        </div>
        <PackList />
      </section>

      {next ? (
        <section className="bg-ink">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
            <div>
              <p className="font-display text-xs tracking-[0.28em] text-gold">{text("rsvp_kicker")}</p>
              <h2 className="mt-3 font-display text-4xl uppercase">{text("rsvp_title")}</h2>
              <p className="mt-4 text-sm text-muted">{text("rsvp_body")}</p>
              <div className="mt-8">
                <RsvpPanel event={next} compact />
              </div>
            </div>
            <div>
              <p className="font-display text-xs tracking-[0.28em] text-gold">THE WALL</p>
              <h2 className="mt-3 font-display text-4xl uppercase">Shouts from the crew</h2>
              <div className="mt-8">
                <ShoutoutWall limit={3} />
              </div>
              <Link
                to="/tribe"
                className="mt-6 inline-flex items-center gap-2 font-display text-sm tracking-[0.16em] uppercase text-gold"
              >
                Open the Tribe board <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="relative overflow-hidden">
        <SiteImage slot="morning" alt="Saturday night under the Tribe setup" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-night/75" />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
          <p className="font-display text-xs tracking-[0.28em] text-gold">{text("close_kicker")}</p>
          <h2 className="mt-4 font-display text-4xl uppercase sm:text-6xl">{text("close_title")}</h2>
          <p className="mx-auto mt-4 max-w-lg text-cream/85">{text("close_body")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/schedule">Pick a game</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={FACEBOOK_GROUP} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
