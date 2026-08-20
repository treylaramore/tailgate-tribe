import { Link } from "@tanstack/react-router";
import { SITE } from "@/data/site";
import { TentMark } from "@/components/TentMark";
import { JerseyStripe } from "@/components/JerseyStripe";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <JerseyStripe />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-6">
          <div className="flex items-center gap-3">
            <TentMark />
            <p className="font-display text-2xl uppercase tracking-wide text-cream">
              Tailgate Tribe
            </p>
          </div>
          <p className="mt-4 max-w-md text-muted">
            {SITE.tagline} at every home football game. Free, family-friendly, and
            fun under the inflatable tent.
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="kicker">On the lot</p>
          <ul className="mt-3 space-y-2 text-sm text-cream/90">
            <li>
              <Link to="/schedule" className="hover:text-gold">
                2026 schedule
              </Link>
            </li>
            <li>
              <Link to="/gameday" className="hover:text-gold">
                First-timer playbook
              </Link>
            </li>
            <li>
              <Link to="/find-us" className="hover:text-gold">
                Find the tent
              </Link>
            </li>
            <li>
              <Link to="/the-tribe" className="hover:text-gold">
                FAQ & what to bring
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="kicker">The group</p>
          <ul className="mt-3 space-y-2 text-sm text-cream/90">
            <li>
              <a
                href={SITE.facebookGroup}
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold"
              >
                Facebook group
              </a>
            </li>
            <li>
              <a
                href={SITE.facebookEvents}
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold"
              >
                Event listings
              </a>
            </li>
            <li className="text-muted">{SITE.location.city}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            Independent fan gathering. Not affiliated with Florida State University
            or Seminole Athletics.
          </p>
          <p>© {SITE.season} Tailgate Tribe</p>
        </div>
      </div>
    </footer>
  );
}
