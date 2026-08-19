import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-chrome";
import { FACEBOOK_GROUP } from "@/lib/events";
import { parseFaqs } from "@/lib/site-content";
import { useSite } from "@/lib/site-provider";

export const Route = createFileRoute("/faq")({ component: FaqPage });

function FaqPage() {
  const { text } = useSite();
  const faqs = parseFaqs(text("faq_json"));
  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <p className="font-display text-xs tracking-[0.28em] text-gold">{text("faq_kicker")}</p>
        <h1 className="mt-3 font-display text-5xl uppercase">{text("faq_title")}</h1>
        <p className="mt-4 text-muted">{text("faq_intro")}</p>
        <div className="mt-10 space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group bg-ink px-5 py-2 shadow-[0_0_0_1px_rgba(243,230,200,0.08)] open:shadow-[0_0_0_1px_rgba(201,162,74,0.4)]"
            >
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-display text-lg uppercase tracking-wide text-cream">
                {item.q}
                <span className="text-gold transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted">
          Still unsure?{" "}
          <a href={FACEBOOK_GROUP} target="_blank" rel="noreferrer" className="text-gold hover:text-gold-soft">
            Ask in the Facebook group.
          </a>
        </p>
      </main>
    </SiteShell>
  );
}
