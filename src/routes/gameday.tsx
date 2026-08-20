import { createFileRoute, Link } from "@tanstack/react-router";
import { AMENITIES, PLAYBOOK, SITE, TRADITIONS } from "@/data/site";
import { Button } from "@/components/ui/button";
import { PackingList } from "@/components/PackingList";

export const Route = createFileRoute("/gameday")({
  head: () => ({
    meta: [{ title: "Gameday Playbook · Tailgate Tribe" }],
  }),
  component: GamedayPage,
});

function GamedayPage() {
  return (
    <main id="main" className="bg-bg pt-24">
      <section className="relative overflow-hidden">
        <img
          src="/photos/canopy-lounge.jpg"
          alt="Inside the Tailgate Tribe canopy: chairs, couches, and a screen"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/65" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="kicker">First-timer playbook</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl uppercase text-cream sm:text-7xl">
            Punch, then inside
          </h1>
          <p className="mt-5 max-w-xl text-lg text-cream/85">
            You don’t need a booster pass, a pop-up, or a cousin who already
            knows everyone. Pour a cup, catch the Heritage Walk and Skull
            Session if you want, then head inside for the Noles.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="kicker">The day</p>
        <h2 className="mt-3 font-display text-4xl uppercase text-cream md:text-5xl">
          How a Tribe Saturday goes
        </h2>
        <ol className="mt-12 space-y-6">
          {PLAYBOOK.map((item) => (
            <li
              key={item.step}
              className="grid gap-4 border-b border-border pb-6 md:grid-cols-12 md:items-start"
            >
              <p className="kicker md:col-span-2">{item.step}</p>
              <div className="md:col-span-10">
                <h3 className="font-display text-3xl uppercase text-cream">{item.title}</h3>
                <p className="mt-2 max-w-2xl text-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker">Traditions</p>
          <h2 className="mt-3 font-display text-4xl uppercase text-cream md:text-5xl">
            How we do gameday
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {TRADITIONS.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-bg p-6"
              >
                <h3 className="font-display text-2xl uppercase text-gold">{item.title}</h3>
                <p className="mt-3 text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker">The setup</p>
          <h2 className="mt-3 font-display text-4xl uppercase text-cream md:text-5xl">
            Shade, seats, and a tomahawk toss
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <figure className="overflow-hidden rounded-2xl border border-border">
              <img
                src="/photos/canopy-lounge.jpg"
                alt="Inside the canopy: chairs, inflatable couches, a screen, and a ground mat"
                className="aspect-4/3 size-full object-cover"
              />
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-border">
              <img
                src="/photos/tomahawk.jpg"
                alt="Inflatable tomahawk toss with a wood-grain frame and bullseye"
                className="aspect-4/3 size-full object-cover"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker">Under the tent</p>
          <h2 className="mt-3 font-display text-4xl uppercase text-cream">
            What’s waiting
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {AMENITIES.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <h3 className="font-display text-2xl uppercase text-cream">{item.title}</h3>
                <p className="mt-3 text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="kicker">Pack the bag</p>
            <h2 className="mt-3 font-display text-4xl uppercase text-cream">
              Tap what you’re bringing
            </h2>
            <p className="mt-4 text-muted">
              It stays on this device only. Punch is on the table. BYOB if you
              want your own drinks — no extra required.
            </p>
          </div>
          <div className="lg:col-span-7">
            <PackingList />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg py-16">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3 px-4 sm:px-6">
          <Button asChild size="lg">
            <Link to="/find-us">Find the tent</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={SITE.facebookGroup} target="_blank" rel="noreferrer">
              Tell us you’re coming
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
