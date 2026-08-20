export const SITE = {
  name: "Tailgate Tribe",
  tagline: "Gameday fellowship for Seminole fans",
  season: "2026",
  description:
    "A free, family-friendly tailgate for Florida State fans at every home football game. Look for the inflatable tent east of Lot 8.",
  facebookGroup: "https://www.facebook.com/groups/tailgatetribe/",
  facebookEvents: "https://www.facebook.com/share/g/1Dp7rGwiKw/",
  location: {
    label: "East of Lot 8",
    street: "NW corner of Pensacola Street and Varsity Drive",
    detail:
      "Our tailgate sits in the grassy area to the east of Lot 8. Look for the black inflatable arch and the garnet sail with Tailgate Tribe on it — you can’t miss it.",
    city: "Tallahassee, Florida",
    query: "30.4390911,-84.3011454",
    lat: 30.4390911,
    lng: -84.3011454,
  },
} as const;

export type Game = {
  id: string;
  opponent: string;
  short: string;
  nickname?: string;
  date: string;
  home: boolean;
  venue: string;
  kickoff?: string;
  tailgateStart?: string;
  tailgateLabel?: string;
  kickoffLabel: string;
  tv?: string;
  facebookUrl?: string;
  tribeEvent: boolean;
  note?: string;
};

export const GAMES: Game[] = [
  {
    id: "nmsu",
    opponent: "New Mexico State",
    short: "NMSU",
    date: "2026-08-29",
    home: true,
    venue: "Doak Campbell Stadium",
    kickoff: "2026-08-29T19:00:00-04:00",
    tailgateStart: "2026-08-29T12:00:00-04:00",
    tailgateLabel: "Noon tailgate",
    kickoffLabel: "7:00 PM kickoff",
    tv: "The CW",
    facebookUrl: "https://www.facebook.com/share/1BsfnyKz7a/",
    tribeEvent: true,
  },
  {
    id: "smu",
    opponent: "SMU",
    short: "SMU",
    date: "2026-09-07",
    home: true,
    venue: "Doak Campbell Stadium",
    kickoff: "2026-09-07T19:30:00-04:00",
    tailgateStart: "2026-09-07T12:00:00-04:00",
    tailgateLabel: "Noon tailgate",
    kickoffLabel: "7:30 PM kickoff",
    tv: "ESPN",
    facebookUrl: "https://www.facebook.com/share/1L7URfxUqV/",
    tribeEvent: true,
    note: "Labor Day Monday",
  },
  {
    id: "alabama",
    opponent: "Alabama",
    short: "Bama",
    date: "2026-09-19",
    home: false,
    venue: "Bryant-Denny Stadium, Tuscaloosa",
    kickoff: "2026-09-19T15:30:00-04:00",
    tailgateStart: "2026-09-19T08:00:00-04:00",
    tailgateLabel: "8:00 AM gathering",
    kickoffLabel: "3:30 PM kickoff",
    tv: "ABC",
    facebookUrl: "https://www.facebook.com/share/1CG9AQDxCs/",
    tribeEvent: true,
    note: "Road game — check Facebook for where the Tribe is gathering",
  },
  {
    id: "cark",
    opponent: "Central Arkansas",
    short: "UCA",
    date: "2026-09-26",
    home: true,
    venue: "Doak Campbell Stadium",
    kickoffLabel: "Kickoff TBA",
    facebookUrl: "https://www.facebook.com/share/18dvwR5sF9/",
    tribeEvent: true,
    note: "Tailgate time TBA — we’ll post it in the group",
  },
  {
    id: "virginia",
    opponent: "Virginia",
    short: "UVA",
    date: "2026-10-03",
    home: true,
    venue: "Doak Campbell Stadium",
    kickoffLabel: "Kickoff TBA",
    facebookUrl: "https://www.facebook.com/share/1EN998erJo/",
    tribeEvent: true,
    note: "Jefferson–Eppes Trophy. Tailgate time TBA.",
  },
  {
    id: "louisville",
    opponent: "Louisville",
    short: "UL",
    date: "2026-10-09",
    home: false,
    venue: "L&N Stadium, Louisville",
    kickoff: "2026-10-09T19:00:00-04:00",
    kickoffLabel: "7:00 PM kickoff",
    tv: "ESPN",
    tribeEvent: false,
  },
  {
    id: "miami",
    opponent: "Miami",
    short: "Miami",
    date: "2026-10-17",
    home: false,
    venue: "Hard Rock Stadium, Miami Gardens",
    kickoffLabel: "Kickoff TBA",
    tribeEvent: false,
  },
  {
    id: "clemson",
    opponent: "Clemson",
    short: "Clemson",
    date: "2026-10-31",
    home: true,
    venue: "Doak Campbell Stadium",
    kickoffLabel: "Kickoff TBA",
    facebookUrl: "https://www.facebook.com/share/1BQ7zTaraq/",
    tribeEvent: true,
    note: "Tailgate time TBA — we’ll post it in the group",
  },
  {
    id: "bc",
    opponent: "Boston College",
    short: "BC",
    date: "2026-11-07",
    home: false,
    venue: "Alumni Stadium, Chestnut Hill",
    kickoffLabel: "Kickoff TBA",
    tribeEvent: false,
  },
  {
    id: "pitt",
    opponent: "Pittsburgh",
    short: "Pitt",
    date: "2026-11-13",
    home: false,
    venue: "Acrisure Stadium, Pittsburgh",
    kickoff: "2026-11-13T19:00:00-05:00",
    kickoffLabel: "7:00 PM kickoff",
    tv: "ESPN",
    tribeEvent: false,
  },
  {
    id: "ncstate",
    opponent: "NC State",
    short: "NCST",
    date: "2026-11-21",
    home: true,
    venue: "Doak Campbell Stadium",
    kickoffLabel: "Kickoff TBA",
    facebookUrl: "https://www.facebook.com/share/14fyNw3FkwR/",
    tribeEvent: true,
    note: "Tailgate time TBA — we’ll post it in the group",
  },
  {
    id: "florida",
    opponent: "Florida",
    short: "Floriduh",
    nickname: "Floriduh",
    date: "2026-11-27",
    home: true,
    venue: "Doak Campbell Stadium",
    kickoff: "2026-11-27T15:30:00-05:00",
    tailgateStart: "2026-11-27T10:30:00-05:00",
    tailgateLabel: "10:30 AM tailgate",
    kickoffLabel: "3:30 PM kickoff",
    tv: "ABC",
    facebookUrl: "https://www.facebook.com/share/1CXZNhpbVH/",
    tribeEvent: true,
    note: "Friday rivalry.",
  },
];

export const BYES = [
  { id: "bye-1", date: "2026-09-12", label: "Open date — no game" },
  { id: "bye-2", date: "2026-10-24", label: "Open date — no game" },
] as const;

export const FAQS = [
  {
    q: "Who are you?",
    a: "Seminole faithful fans who get together for each home football game. We aren’t trying to sell you anything or get your money — we just want a fun, family-friendly environment for Seminole fans without a tailgate of their own.",
  },
  {
    q: "Where are you?",
    a: "Look for us at the NW corner of Pensacola Street and Varsity Drive. Our tailgate is in the grassy area to the east of Lot 8. We have a black inflatable canopy with our name and spear on the sail — you can’t miss it.",
  },
  {
    q: "What should I bring?",
    a: "We’ll have punch on the table and some places to sit. Bring a tailgate chair if you plan to hang out. BYOB is welcome if you want your own drinks — you don’t need to bring extra to share.",
  },
  {
    q: "Who is welcome?",
    a: "We are a friendly crew, and everyone is welcome as long as they are respectful and following the rules set forth by Florida State University. We’ll have alcoholic drinks on site, and we intend to keep the tailgate family-friendly, laid back, and fun.",
  },
  {
    q: "Do I need reservations?",
    a: "No reservation required. RSVP on the Facebook event for that game if you can — it helps us plan. Walking up without one is still welcome. Stay ten minutes or stay until you head inside.",
  },
  {
    q: "Can I sell or advertise at the tailgate?",
    a: "No. Florida State has a strong set of rules against commercial sales and advertising for anyone that is not an official partner or sponsor of Seminole Athletics. Wear a shirt with your business name if you want — just please don’t turn the tent into a storefront.",
  },
  {
    q: "Is this an official FSU event?",
    a: "No. Tailgate Tribe is an independent gathering of fans. We follow FSU gameday rules, but we are not affiliated with Florida State University or Seminole Athletics.",
  },
  {
    q: "Where should I park?",
    a: "Not in Lot 8 — that’s reserved booster parking. Use public or game-day lots and walk over. The inflatable tent is the landmark, not a parking pass. Official maps live on FSU’s gameday parking pages.",
  },
] as const;

export const PACKING = [
  { id: "chair", label: "A tailgate chair if you’re staying a while" },
  { id: "drink", label: "Your own drinks if you want them — BYOB is welcome" },
  { id: "colors", label: "Garnet and gold" },
  { id: "sun", label: "Hat, sunscreen, or a light layer" },
  { id: "kids", label: "Kid gear, if little Noles are coming" },
  { id: "kind", label: "A friendly attitude" },
] as const;

export const PILLARS = [
  {
    title: "Free, always",
    body: "No tickets, no wristbands, no pitch. We aren’t trying to get your money. We just want Noles to have a place to land on gameday.",
  },
  {
    title: "Family friendly",
    body: "Kids are welcome. Tomahawk toss, chairs, and a laid-back tent. There is alcohol on site, and we keep the atmosphere respectful.",
  },
  {
    title: "You already belong",
    body: "Don’t have a tailgate of your own? You do now. Pull up a chair. Stay for ten minutes or stay until you head inside.",
  },
] as const;

export const AMENITIES = [
  {
    title: "The inflatable canopy",
    body: "Black arches, a garnet sail, and our spear on the front. Shade, a landmark, and the living room — chairs, couches, and TVs for the rest of gameday. The FSU game itself is inside Doak.",
  },
  {
    title: "Tomahawk toss",
    body: "An inflatable axe-throw next to the tent. Kids and grown-ups both get a turn. Don’t stand behind the target.",
  },
  {
    title: "BYOB is welcome",
    body: "Bring whatever you want to drink and keep it for yourself. Nobody expects you to stock the tent. Punch is on the table if you want a cup.",
  },
  {
    title: "Garnet and gold punch",
    body: "Two dispensers on the table — one red, one gold. Cups next to them. Help yourself.",
  },
] as const;

export const PLAYBOOK = [
  {
    step: "01",
    title: "Tent goes up",
    body: "We raise the inflatable at the published tailgate time. East of Lot 8, NW corner of Pensacola and Varsity.",
  },
  {
    step: "02",
    title: "Walk up like you belong",
    body: "No gate, no list, no handshake password. Say hey. Grab a chair. Stay ten minutes or stay until you head inside.",
  },
  {
    step: "03",
    title: "The hang",
    body: "Punch, tomahawk toss, TVs on other games. New faces, old friends. The Noles play inside Doak — not on our screens.",
  },
  {
    step: "04",
    title: "Heritage Walk",
    body: "Optional. Players walk into Doak from Heritage Fountain, usually a couple of hours before kickoff. Cheer them in, then peel off — we don’t move as a pack.",
  },
  {
    step: "05",
    title: "Skull Session, then inside",
    body: "The Marching Chiefs play at Dick Howser right after the walk — section cheers and a peek at halftime. Then kickoff is in the stadium. See you next home game.",
  },
] as const;

export const TRADITIONS = [
  {
    title: "The tent is the landmark",
    body: "We don’t do scavenger hunts. Black inflatable arch, garnet sail, Tailgate Tribe on the front, grassy patch east of Lot 8.",
  },
  {
    title: "Heritage Walk",
    body: "Players walk into Doak from Heritage Fountain. Catch it if you want. We don’t expect the tent to empty as a group.",
  },
  {
    title: "Skull Session",
    body: "Marching Chiefs at Dick Howser, right after the walk. Section cheers, a cut of the halftime show, then inside for kickoff.",
  },
  {
    title: "Tomahawk toss",
    body: "The inflatable axe-throw is part of the tent, not a side quest. Take a turn. Cheer for the kid in front of you.",
  },
  {
    title: "The War Chant",
    body: "When it starts, the tent gets loud. If you’re new, watch the people next to you and join in. Nobody is grading you.",
  },
] as const;

export const GALLERY = [
  { src: "/photos/tent.jpg", alt: "The Tailgate Tribe inflatable canopy — black arches and a garnet sail with the spear logo" },
  { src: "/photos/canopy-lounge-43.jpg", alt: "Inside the canopy: chairs, inflatable couches, a screen, and a pink ground mat" },
  { src: "/photos/tomahawk.jpg", alt: "Inflatable tomahawk toss game with a wood-grain frame and bullseye target" },
  { src: "/photos/canopy-inside.jpg", alt: "Looking out from under the canopy: folding chairs, tables, and beige inflatable couches" },
  { src: "/photos/feast.jpg", alt: "Pulled-pork sliders, chips, and gold cups on a tailgate table" },
  { src: "/photos/punch.jpg", alt: "Two punch dispensers — one garnet red, one gold — on a tailgate table" },
] as const;
