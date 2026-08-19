import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Navigation } from "lucide-react";
import { SiteShell } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { resolveLocation } from "@/lib/site-content";
import { SiteImage, useSite } from "@/lib/site-provider";

export const Route = createFileRoute("/location")({ component: LocationPage });

function LocationPage() {
  const { text } = useSite();
  const spot = resolveLocation(text);
  const dest = encodeURIComponent(`${spot.lat},${spot.lng}`);
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${spot.lng - 0.003}%2C${spot.lat - 0.002}%2C${spot.lng + 0.003}%2C${spot.lat + 0.002}&layer=mapnik&marker=${spot.lat}%2C${spot.lng}`;

  return (
    <SiteShell>
      <main>
        <section className="relative">
          <SiteImage
            slot="tent"
            alt="The Tailgate Tribe inflatable tent — look for the gold T and spear"
            className="h-[42svh] w-full object-cover object-[center_28%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-8 sm:px-6">
            <p className="font-display text-xs tracking-[0.28em] text-gold">{text("loc_kicker")}</p>
            <h1 className="mt-2 font-display text-5xl uppercase sm:text-6xl">{text("loc_title")}</h1>
          </div>
        </section>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 size-5 text-gold" />
              <div>
                <h2 className="font-display text-2xl uppercase">{spot.name}</h2>
                <p className="mt-2 text-cream">{spot.intersection}</p>
                <p className="text-muted">{spot.city}</p>
                <p className="mt-2 font-mono text-sm tracking-wide text-gold">
                  {spot.lat}, {spot.lng}
                </p>
                <p className="mt-4 text-sm text-cream/90">{spot.detail}</p>
              </div>
            </div>
            <ol className="mt-8 space-y-4">
              {[text("loc_step_1"), text("loc_step_2"), text("loc_step_3"), text("loc_step_4")].map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="font-display text-xl text-gold">{String(index + 1).padStart(2, "0")}</span>
                  <p className="pt-0.5 text-cream">{step}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${dest}`} target="_blank" rel="noreferrer">
                  <Navigation className="size-4" />
                  Google Maps
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={`https://maps.apple.com/?daddr=${dest}`} target="_blank" rel="noreferrer">
                  Apple Maps
                </a>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden shadow-[0_0_0_1px_rgba(243,230,200,0.1)]">
            <iframe title="Map of Tailgate Tribe" src={embed} className="h-[420px] w-full border-0 bg-ink" />
          </div>
        </section>
        <section className="bg-ink">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
            {[
              { title: "Parking", copy: text("loc_parking") },
              { title: "Landmark", copy: text("loc_landmark") },
              { title: "Road games", copy: text("loc_road") },
            ].map((card) => (
              <article key={card.title}>
                <h3 className="font-display text-xl uppercase text-gold">{card.title}</h3>
                <p className="mt-3 text-sm text-cream/85">{card.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
