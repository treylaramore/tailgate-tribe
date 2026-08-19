import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { RsvpPanel } from "@/components/rsvp-panel";
import { SiteShell } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { getEvent, kickoffLabel, tentLabel } from "@/lib/events";

export const Route = createFileRoute("/schedule/$eventId")({
  loader: ({ params }) => {
    const event = getEvent(params.eventId);
    if (!event) throw notFound();
    return event;
  },
  component: EventPage,
});

function EventPage() {
  const event = Route.useLoaderData();
  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <Link to="/schedule" className="inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-gold">
          <ArrowLeft className="size-4" /> Full slate
        </Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-display text-xs tracking-[0.28em] text-gold">
              {event.home ? "HOME" : "AWAY"} · {event.weekday.toUpperCase()} {event.date.toUpperCase()}
            </p>
            <h1 className="mt-3 font-display text-5xl uppercase sm:text-7xl">{event.opponent}</h1>
            {event.nickname ? <p className="mt-2 text-lg text-muted">{event.nickname}</p> : null}
            <dl className="mt-8 space-y-3 text-cream">
              <div className="flex items-center gap-3">
                <Clock className="size-5 text-gold" />
                <div>
                  <dt className="text-xs tracking-[0.16em] text-muted uppercase">Kickoff</dt>
                  <dd>{kickoffLabel(event)}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-gold" />
                <div>
                  <dt className="text-xs tracking-[0.16em] text-muted uppercase">Tailgate</dt>
                  <dd>{tentLabel(event)}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-gold" />
                <div>
                  <dt className="text-xs tracking-[0.16em] text-muted uppercase">Spot</dt>
                  <dd>
                    {event.hasTribe
                      ? event.home
                        ? "East of Lot 8 · inflatable tent"
                        : "Road Tribe — Facebook has the pin"
                      : "No Tribe tent this week"}
                  </dd>
                </div>
              </div>
            </dl>
            {event.note ? <p className="mt-6 max-w-lg text-cream/90">{event.note}</p> : null}
            {event.trophy ? (
              <p className="mt-4 font-display text-sm tracking-[0.18em] text-gold uppercase">{event.trophy}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              {event.facebook ? (
                <Button asChild>
                  <a href={event.facebook} target="_blank" rel="noreferrer">
                    Facebook event
                  </a>
                </Button>
              ) : null}
              {event.hasTribe && event.home ? (
                <Button asChild variant="outline">
                  <Link to="/location">Directions</Link>
                </Button>
              ) : null}
            </div>
          </div>
          <div className="bg-ink p-5 shadow-[0_0_0_1px_rgba(243,230,200,0.08)] sm:p-6">
            <RsvpPanel event={event} />
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
