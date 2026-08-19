import { LOT } from "@/lib/events";

export const DEFAULT_COPY: Record<string, string> = {
  tribe_verb: "chanting",
  cta_primary: "I'm chanting",
  cta_find: "Find the tent",
  rsvp_who: "WHO'S CHANTING",
  hero_kicker: "2026 SEASON · TALLAHASSEE",
  hero_title: "Find your people.",
  hero_gold: "Skip the stress.",
  hero_body:
    "Gameday fellowship for Seminole fans at every home football game. Family-friendly. No tickets to buy. Just a tent, a grill, and a crew that wants you there.",
  how_kicker: "01 — HOW IT WORKS",
  how_title: "Drop in. Stay as long as you want.",
  how_1_title: "Find the tent",
  how_1_copy:
    "NW corner of Pensacola and Varsity, grassy lot east of Lot 8. Big inflatable tent. You cannot miss it.",
  how_2_title: "Pull up a chair",
  how_2_copy:
    "We share a limited spread of food and drinks. Bring a favorite beverage or a chair if you are staying all day.",
  how_3_title: "Keep it easy",
  how_3_copy:
    "Family-friendly, laid back, FSU rules. Nobody is selling you anything. Everyone respectful is welcome.",
  who_kicker: "02 — WHO THIS IS FOR",
  who_title: "Don't have a tailgate of your own? You do now.",
  who_1: "Seminole faithful who want fellowship, not a scene",
  who_2: "Families who want a respectful, fun lot",
  who_3: "Alumni back in town with nowhere to land",
  who_4: "First-timers who just need a flag to find",
  season_kicker: "03 — THE SEASON",
  season_title: "Tribe dates",
  find_kicker: "04 — FIND US",
  find_title: "East of Lot 8. Look for the tent.",
  find_address:
    "NW corner of Pensacola Street and Varsity Drive, Tallahassee. Grassy area east of Lot 8.",
  pack_kicker: "05 — PACK THE WAGON",
  pack_title: "What to bring",
  pack_body:
    "We put out a limited selection of food and drinks — alcoholic and not. This list lives on your phone so you don't forget the chair.",
  rsvp_kicker: "06 — PUT YOUR NAME IN",
  rsvp_title: "Help us plan the spread.",
  rsvp_body: "No reservations required — drop by anytime. A heads-up just means we buy enough wings.",
  close_kicker: "SEE YOU SATURDAY",
  close_title: "Experience gameday with other Noles.",
  close_body: "Take the stress off yourself. We will be under the tent.",
  footer_headline: "Gameday fellowship for Seminole fans.",
  footer_body:
    "We are not selling you anything. We are a crew of Noles who set a tent so nobody has to do gameday alone.",
  footer_spot_label: "THE USUAL SPOT",
  footer_spot: "NW corner of Pensacola & Varsity\nEast of Lot 8 · Tallahassee",
  footer_disclaimer: "Independent fan gathering · Not affiliated with Florida State Athletics",
  loc_kicker: "THE PIN",
  loc_title: "Find the tent",
  loc_name: LOT.name,
  loc_intersection: LOT.intersection,
  loc_city: LOT.city,
  loc_detail: LOT.detail,
  loc_lat: String(LOT.lat),
  loc_lng: String(LOT.lng),
  loc_step_1: "Come down Pensacola Street toward campus.",
  loc_step_2: "Hit Varsity Drive. We are on the northwest corner.",
  loc_step_3: "Walk the grass east of Lot 8 until you see the inflatable tent.",
  loc_step_4: "If you can hear the grill and see gold streamers, you are home.",
  loc_parking:
    "Lot 8 and nearby gameday lots fill early. Give yourself time, or rideshare to Pensacola & Varsity and walk in.",
  loc_landmark:
    "Big inflatable tent with the gold T, spear, and Tailgate Tribe on the side. If you are staring at asphalt, you went too far west.",
  loc_road: "Alabama is the one away meet-up on the Tribe calendar. Pin and time live on the Facebook event.",
  tribe_kicker: "THE BOARD",
  tribe_title: "The Tribe",
  tribe_body: "Put your name on a Saturday. Leave a shout. This is how we know how many chairs to drag out.",
  faq_kicker: "THE FINE PRINT",
  faq_title: "How the Tribe works",
  faq_intro: "Same answers as the old site — just easier to read on a phone while you are looking for parking.",
  faq_json: "",
};

export const DEFAULT_FAQS = [
  {
    q: "Who are you?",
    a: "Seminole faithful who get together for each home football game. We are not trying to sell you anything or get your money. We just want a fun, family-friendly place for Noles who do not have a tailgate of their own.",
  },
  {
    q: "Where are you?",
    a: "NW corner of Pensacola Street and Varsity Drive. The tent sits on the grassy area east of Lot 8. Big inflatable tent with the tailgate name on the side — you cannot miss it.",
  },
  {
    q: "What should I bring?",
    a: "We put out a limited selection of food and beverages (alcoholic and not) plus places to sit. Bring a favorite drink or a tailgate chair if you plan to spend the day.",
  },
  {
    q: "Who is welcome?",
    a: "Everyone, as long as they are respectful and follow Florida State University rules. We will have adult drinks on site, and we still keep the lot family-friendly, laid back, and fun.",
  },
  {
    q: "Do I need a reservation?",
    a: "No. This is not a formal event. Drop by for ten minutes or stay until kickoff. If you know you are coming, RSVP here or message us on Facebook so we can be ready.",
  },
  {
    q: "Can I sell or advertise at the tailgate?",
    a: "No. Florida State has clear rules against commercial sales and advertising unless you are an official partner of Seminole Athletics. A shirt with your business name is fine. Handing out flyers or selling anything is not.",
  },
  {
    q: "Is this an official FSU event?",
    a: "No. Tailgate Tribe is an independent fan gathering. We follow university lot rules. We are not affiliated with Florida State Athletics.",
  },
  {
    q: "What about away games?",
    a: "Home games are the regular tent. Alabama is on the calendar as a Road Tribe meet-up — check the Facebook event for the pin. Other road weeks we cheer from wherever we are.",
  },
];

DEFAULT_COPY.faq_json = JSON.stringify(DEFAULT_FAQS);

export type ImageSlot = {
  id: string;
  label: string;
  hint: string;
  fallback: string;
};

export const IMAGE_SLOTS: ImageSlot[] = [
  { id: "hero", label: "Homepage hero", hint: "Night setup / sofas. Wide.", fallback: "/images/hero.jpg" },
  { id: "tent", label: "The tent", hint: "TTL canopy. Used on Home and Find Us.", fallback: "/images/tent.jpg" },
  { id: "friends", label: "The crew", hint: "People at the tailgate.", fallback: "/images/friends.jpg" },
  { id: "stadium", label: "Stadium / lot", hint: "Walk-up or night lot. Also login.", fallback: "/images/stadium.jpg" },
  { id: "feast", label: "Food table", hint: "Spread / tables.", fallback: "/images/feast.jpg" },
  { id: "morning", label: "Closing band", hint: "Full-width photo behind the last pitch.", fallback: "/images/morning.jpg" },
  { id: "logo", label: "Logo", hint: "Header, footer, and tent mark. PNG is best.", fallback: "/images/logo.png" },
];

export const COPY_FIELDS = [
  { key: "tribe_verb", label: "Attendance word (chanting)", group: "Voice" },
  { key: "cta_primary", label: "Hero button", group: "Voice" },
  { key: "cta_find", label: "Find-the-tent button", group: "Voice" },
  { key: "rsvp_who", label: "RSVP heading (WHO'S CHANTING)", group: "Voice" },
  { key: "hero_kicker", label: "Eyebrow", group: "Home — hero" },
  { key: "hero_title", label: "Headline", group: "Home — hero" },
  { key: "hero_gold", label: "Gold line", group: "Home — hero" },
  { key: "hero_body", label: "Paragraph", group: "Home — hero", multiline: true },
  { key: "how_kicker", label: "Eyebrow", group: "Home — how it works" },
  { key: "how_title", label: "Headline", group: "Home — how it works" },
  { key: "how_1_title", label: "Card 1 title", group: "Home — how it works" },
  { key: "how_1_copy", label: "Card 1 text", group: "Home — how it works", multiline: true },
  { key: "how_2_title", label: "Card 2 title", group: "Home — how it works" },
  { key: "how_2_copy", label: "Card 2 text", group: "Home — how it works", multiline: true },
  { key: "how_3_title", label: "Card 3 title", group: "Home — how it works" },
  { key: "how_3_copy", label: "Card 3 text", group: "Home — how it works", multiline: true },
  { key: "who_kicker", label: "Eyebrow", group: "Home — who it's for" },
  { key: "who_title", label: "Headline", group: "Home — who it's for" },
  { key: "who_1", label: "Bullet 1", group: "Home — who it's for" },
  { key: "who_2", label: "Bullet 2", group: "Home — who it's for" },
  { key: "who_3", label: "Bullet 3", group: "Home — who it's for" },
  { key: "who_4", label: "Bullet 4", group: "Home — who it's for" },
  { key: "season_kicker", label: "Eyebrow", group: "Home — season" },
  { key: "season_title", label: "Headline", group: "Home — season" },
  { key: "find_kicker", label: "Eyebrow", group: "Home — find us" },
  { key: "find_title", label: "Headline", group: "Home — find us" },
  { key: "find_address", label: "Address", group: "Home — find us", multiline: true },
  { key: "pack_kicker", label: "Eyebrow", group: "Home — pack" },
  { key: "pack_title", label: "Headline", group: "Home — pack" },
  { key: "pack_body", label: "Paragraph", group: "Home — pack", multiline: true },
  { key: "rsvp_kicker", label: "Eyebrow", group: "Home — RSVP" },
  { key: "rsvp_title", label: "Headline", group: "Home — RSVP" },
  { key: "rsvp_body", label: "Paragraph", group: "Home — RSVP", multiline: true },
  { key: "close_kicker", label: "Eyebrow", group: "Home — close" },
  { key: "close_title", label: "Headline", group: "Home — close" },
  { key: "close_body", label: "Paragraph", group: "Home — close", multiline: true },
  { key: "footer_headline", label: "Headline", group: "Footer" },
  { key: "footer_body", label: "Paragraph", group: "Footer", multiline: true },
  { key: "footer_spot_label", label: "Spot label", group: "Footer" },
  { key: "footer_spot", label: "Spot text", group: "Footer", multiline: true },
  { key: "footer_disclaimer", label: "Disclaimer", group: "Footer" },
  { key: "loc_kicker", label: "Eyebrow", group: "Find us page" },
  { key: "loc_title", label: "Headline", group: "Find us page" },
  { key: "loc_name", label: "Spot name", group: "Find us page" },
  { key: "loc_intersection", label: "Intersection", group: "Find us page" },
  { key: "loc_city", label: "City", group: "Find us page" },
  { key: "loc_detail", label: "Detail", group: "Find us page", multiline: true },
  { key: "loc_lat", label: "Latitude", group: "Find us page" },
  { key: "loc_lng", label: "Longitude", group: "Find us page" },
  { key: "loc_step_1", label: "Step 1", group: "Find us page" },
  { key: "loc_step_2", label: "Step 2", group: "Find us page" },
  { key: "loc_step_3", label: "Step 3", group: "Find us page" },
  { key: "loc_step_4", label: "Step 4", group: "Find us page" },
  { key: "loc_parking", label: "Parking card", group: "Find us page", multiline: true },
  { key: "loc_landmark", label: "Landmark card", group: "Find us page", multiline: true },
  { key: "loc_road", label: "Road games card", group: "Find us page", multiline: true },
  { key: "tribe_kicker", label: "Eyebrow", group: "Tribe page" },
  { key: "tribe_title", label: "Headline", group: "Tribe page" },
  { key: "tribe_body", label: "Paragraph", group: "Tribe page", multiline: true },
  { key: "faq_kicker", label: "Eyebrow", group: "FAQ" },
  { key: "faq_title", label: "Headline", group: "FAQ" },
  { key: "faq_intro", label: "Intro", group: "FAQ", multiline: true },
] as const;

export type FaqItem = { q: string; a: string };

export function parseFaqs(raw: string): FaqItem[] {
  try {
    const parsed = JSON.parse(raw || "");
    if (!Array.isArray(parsed)) return DEFAULT_FAQS;
    const items = parsed
      .map((item) => ({ q: String(item?.q ?? "").trim(), a: String(item?.a ?? "").trim() }))
      .filter((item) => item.q || item.a);
    return items.length ? items : DEFAULT_FAQS;
  } catch {
    return DEFAULT_FAQS;
  }
}

export function resolveLocation(text: (key: string) => string) {
  const lat = Number(text("loc_lat"));
  const lng = Number(text("loc_lng"));
  return {
    name: text("loc_name"),
    intersection: text("loc_intersection"),
    city: text("loc_city"),
    detail: text("loc_detail"),
    lat: Number.isFinite(lat) ? lat : LOT.lat,
    lng: Number.isFinite(lng) ? lng : LOT.lng,
  };
}
