import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { AMENITIES, FAQS, GALLERY, PILLARS, PLAYBOOK, SITE } from "@/data/site";
import { formatLongDate, nextTribeGame, tribeGames } from "@/lib/schedule";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/Countdown";
import { GameCard } from "@/components/GameCard";
import { WeatherChip } from "@/components/WeatherChip";
import { SeasonStrip } from "@/components/SeasonStrip";
import { AddToCal } from "@/components/AddToCal";
import { JerseyStripe } from "@/components/JerseyStripe";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const next = nextTribeGame();
  const slate = tribeGames().slice(0, 6);

  return (
    <main id="main">
      <section className="relative min-h-svh overflow-hidden">
        <img
          src="/photos/hero.jpg"
          alt="The Tailgate Tribe inflatable canopy at golden hour, black arches and garnet sail with the stadium in the distance"
          className="absolute inset-0 size-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-b from-ink/20 via-ink/40 to-bg" />
        <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col justify-end px-4 pb-10 pt-28 sm:px-6 sm:pb-16">
          <p className="kicker">{SITE.season} season · Tallahassee</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl uppercase leading-none text-cream sm:text-8xl md:text-9xl">
            Tailgate
            <br />
            Tribe
          </h1>
          <p className="mt-5 max-w-xl text-lg text-cream/90 sm:text-xl">
            Gameday fellowship for Seminole fans — every home football game, under
            the inflatable tent. No tailgate tickets. No catch. Just Noles.
          </p>
          {next ? (
            <div className="mt-10 max-w-2xl rounded-2xl border border-border bg-ink/55 p-5 backdrop-blur-sm sm:p-6">
              <p className="kicker">Next tent raise</p>
              <p className="mt-2 font-display text-3xl uppercase text-cream sm:text-4xl">
                vs {next.nickname ?? next.opponent}
              </p>
              <p className="mt-1 text-muted">
                {formatLongDate(next.date)}
                {next.tailgateLabel ? ` · ${next.tailgateLabel}` : ""}
                {` · ${next.kickoffLabel}`}
                {next.tv ? ` · ${next.tv}` : ""}
              </p>
              <div className="mt-4">
                <Countdown game={next} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <WeatherChip date={next.date} />
                <AddToCal game={next} size="sm" />
              </div>
            </div>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/find-us">
                Find the tent
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/gameday">First-timer playbook</Link>
            </Button>
          </div>
        </div>
      </section>

      <SeasonStrip />

      <section className="border-t border-border bg-bg py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker">01 — Who we are</p>
          <div className="mt-4 grid gap-8 md:grid-cols-12">
            <h2 className="font-display text-4xl uppercase text-cream md:col-span-5 md:text-5xl">
              A place to land on gameday
            </h2>
            <p className="max-w-xl text-lg text-muted md:col-span-7">
              Seminole faithful who get together for each home football game. We
              aren’t trying to sell you anything. If you don’t have a tailgate of
              your own, you do now.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PILLARS.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <h3 className="font-display text-2xl uppercase text-gold">{item.title}</h3>
                <p className="mt-3 text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker">02 — Under the tent</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl uppercase text-cream md:text-5xl">
            What you actually get
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {AMENITIES.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-bg p-6"
              >
                <h3 className="font-display text-2xl uppercase text-cream">{item.title}</h3>
                <p className="mt-3 text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">03 — The slate</p>
              <h2 className="mt-3 font-display text-4xl uppercase text-cream md:text-5xl">
                When the tent is up
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/schedule">Full 2026 schedule</Link>
            </Button>
          </div>
          <div className="mt-10 space-y-4">
            {next ? <GameCard game={next} featured /> : null}
            {slate
              .filter((g) => g.id !== next?.id)
              .slice(0, 3)
              .map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border">
        <img
          src="/photos/tent.jpg"
          alt="The Tailgate Tribe canopy: black inflatable arches and a garnet sail with the spear logo"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 sm:py-24 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="kicker">04 — Find us</p>
            <h2 className="mt-3 font-display text-4xl uppercase text-cream md:text-5xl">
              East of Lot 8
            </h2>
            <p className="mt-4 flex items-start gap-2 text-lg text-cream/90">
              <MapPin className="mt-1 size-5 shrink-0 text-gold" />
              {SITE.location.street}
            </p>
            <p className="mt-4 max-w-md text-cream/80">{SITE.location.detail}</p>
            <Button asChild className="mt-8" size="lg">
              <Link to="/find-us">
                Map & landmark
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <ul className="space-y-4 md:col-span-5 md:col-start-8">
            {[
              "Black inflatable arch, garnet sail, spear on the front",
              "Grassy area, east of Lot 8",
              "Drop by for ten minutes or stay until you head inside",
            ].map((line) => (
              <li key={line} className="flex gap-3 text-cream">
                <Check className="mt-1 size-5 shrink-0 text-gold" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">05 — First time?</p>
              <h2 className="mt-3 font-display text-4xl uppercase text-cream md:text-5xl">
                How a Tribe Saturday goes
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/gameday">Full playbook</Link>
            </Button>
          </div>
          <ol className="mt-12 grid gap-4 md:grid-cols-5">
            {PLAYBOOK.map((item) => (
              <li
                key={item.step}
                className="rounded-2xl border border-border bg-bg p-5"
              >
                <p className="kicker">{item.step}</p>
                <h3 className="mt-3 font-display text-xl uppercase text-cream">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-bg py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker">06 — The feel</p>
          <h2 className="mt-3 font-display text-4xl uppercase text-cream md:text-5xl">
            How gameday looks from here
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
            {GALLERY.map((photo) => (
              <figure key={photo.src} className="overflow-hidden rounded-xl">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="aspect-3/4 size-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker">07 — Before you come</p>
          <div className="mt-4 grid gap-10 md:grid-cols-12">
            <h2 className="font-display text-4xl uppercase text-cream md:col-span-5 md:text-5xl">
              Straight answers
            </h2>
            <div className="space-y-6 md:col-span-7">
              {FAQS.slice(0, 4).map((faq) => (
                <div key={faq.q} className="border-b border-border pb-6">
                  <h3 className="font-display text-2xl uppercase text-cream">{faq.q}</h3>
                  <p className="mt-2 text-muted">{faq.a}</p>
                </div>
              ))}
              <Button asChild variant="outline">
                <Link to="/the-tribe">
                  All FAQs & packing list
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <JerseyStripe />
      <section className="bg-garnet py-16 text-center sm:py-20">
        <div className="mx-auto max-w-2xl px-4">
          <p className="kicker">Pull up a chair</p>
          <h2 className="mt-3 font-display text-4xl uppercase text-cream sm:text-5xl">
            Tell us you’re coming
          </h2>
          <p className="mt-4 text-cream/85">
            RSVP on each game’s Facebook event if you can — it helps us plan.
            Walking up without one is still welcome.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="cream">
              <a href={SITE.facebookGroup} target="_blank" rel="noreferrer">
                Open the Facebook group
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={SITE.facebookEvents} target="_blank" rel="noreferrer">
                Tribe events
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
