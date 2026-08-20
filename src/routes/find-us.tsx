import { createFileRoute } from "@tanstack/react-router";
import { Flag, MapPin, Tent, Trees } from "lucide-react";
import { SITE } from "@/data/site";
import { Button } from "@/components/ui/button";
import { LotMap } from "@/components/LotMap";
import { CopyButton } from "@/components/CopyButton";

export const Route = createFileRoute("/find-us")({
  head: () => ({
    meta: [{ title: "Find Us · Tailgate Tribe" }],
  }),
  component: FindUsPage,
});

const STEPS = [
  {
    icon: MapPin,
    title: "Get to the corner",
    body: "NW corner of Pensacola Street and Varsity Drive, on the Florida State campus in Tallahassee.",
  },
  {
    icon: Trees,
    title: "Look east of Lot 8",
    body: "Lot 8 itself is reserved booster parking. We set up on the grass just east of it — not in a numbered stall.",
  },
  {
    icon: Tent,
    title: "Spot the inflatable canopy",
    body: "Black arched tubes, a garnet sail, Tailgate Tribe and the spear on the front. If you can see that, you’re in the right place.",
  },
  {
    icon: Flag,
    title: "Walk up",
    body: "No gate, no list. Say hey, grab a chair, stay as long as you like. A Facebook ping ahead of time helps us set out extra chairs.",
  },
];

function FindUsPage() {
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${SITE.location.lat},${SITE.location.lng}`;
  const address = `${SITE.location.street}, ${SITE.location.city}. East of Lot 8. Pin: ${SITE.location.lat}, ${SITE.location.lng}`;

  return (
    <main id="main" className="bg-bg pt-24">
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <p className="kicker">Landmark</p>
        <h1 className="mt-3 font-display text-5xl uppercase text-cream sm:text-7xl">
          Find the tent
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{SITE.location.detail}</p>
        <p className="mt-3 font-mono text-sm text-gold/90">
          {SITE.location.lat}, {SITE.location.lng}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href={mapsLink} target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
          </Button>
          <CopyButton text={address} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <LotMap />
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:px-6 lg:grid-cols-5">
        <figure className="overflow-hidden rounded-2xl border border-border lg:col-span-3">
          <img
            src="/photos/tent.jpg"
            alt="The Tailgate Tribe inflatable canopy — black arches and garnet sail with the spear logo"
            className="aspect-4/3 size-full object-cover"
          />
        </figure>
        <figure className="relative min-h-96 overflow-hidden rounded-2xl border border-border bg-surface lg:col-span-2">
          <img
            src="/photos/canopy-lounge.jpg"
            alt="Walk-up view of the canopy: chairs, inflatable couches, and a screen"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/80 to-transparent p-5">
            <p className="kicker">Pin this</p>
            <p className="mt-1 font-display text-2xl uppercase text-cream">
              Pensacola & Varsity
            </p>
            <p className="text-sm text-muted">
              East of Lot 8 · {SITE.location.city}
            </p>
          </div>
        </figure>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          {STEPS.map((step, i) => (
            <article
              key={step.title}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <p className="kicker">0{i + 1}</p>
              <div className="mt-3 flex items-center gap-3">
                <step.icon className="size-5 text-gold" />
                <h2 className="font-display text-2xl uppercase text-cream">{step.title}</h2>
              </div>
              <p className="mt-3 text-muted">{step.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href={mapsLink} target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={SITE.facebookGroup} target="_blank" rel="noreferrer">
              Ask us in the group
            </a>
          </Button>
        </div>
        <p className="mt-8 max-w-2xl text-sm text-muted">
          Follow official FSU gameday parking rules. Don’t park in reserved booster
          stalls. If you’re visiting, use public or game-day lots and walk over —
          the tent is the landmark, not a parking pass.
        </p>
      </section>
    </main>
  );
}
