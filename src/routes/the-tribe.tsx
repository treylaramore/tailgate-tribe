import { createFileRoute } from "@tanstack/react-router";
import { FAQS, SITE } from "@/data/site";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PackingList } from "@/components/PackingList";

export const Route = createFileRoute("/the-tribe")({
  head: () => ({
    meta: [{ title: "The Tribe · Tailgate Tribe" }],
  }),
  component: TribePage,
});

function TribePage() {
  return (
    <main id="main" className="bg-bg pt-24">
      <section className="relative overflow-hidden">
        <img
          src="/photos/canopy-lounge.jpg"
          alt="Inside the Tailgate Tribe canopy: chairs, inflatable couches, and a screen"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/65" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="kicker">The people</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl uppercase text-cream sm:text-7xl">
            Friends first. Football second. Stress nowhere.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-cream/85">
            Experience gameday with other Noles and take the stress off yourself.
            We show up, pour the punch, and head inside for the Noles.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="kicker">What to bring</p>
          <h2 className="mt-3 font-display text-4xl uppercase text-cream">
            Your chair, your colors, your people
          </h2>
          <p className="mt-4 text-muted">
            Punch is on the table and there are some seats. BYOB is welcome if
            you want your own drinks — no need to bring extra to share. Tap what
            you’re packing. It stays on this device only.
          </p>
        </div>
        <div className="lg:col-span-7">
          <PackingList />
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="kicker">House rules</p>
          <h2 className="mt-3 font-display text-4xl uppercase text-cream">FAQ</h2>
          <Accordion type="single" collapsible className="mt-8">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border">
        <img
          src="/photos/canopy-lot.jpg"
          alt="The canopy open to the lot"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <p className="kicker">See you under the tent</p>
          <h2 className="mt-3 font-display text-4xl uppercase text-cream">
            Drop a note if you’re joining
          </h2>
          <p className="mt-4 text-cream/85">
            It isn’t a reservation. It just helps us know how many extra chairs
            to drag out of the truck.
          </p>
          <Button asChild size="lg" className="mt-8">
            <a href={SITE.facebookGroup} target="_blank" rel="noreferrer">
              Message the Tribe on Facebook
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
