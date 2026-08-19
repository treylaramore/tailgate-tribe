export type TribeEvent = {
  id: string;
  opponent: string;
  nickname: string;
  date: string;
  weekday: string;
  iso: string;
  kickoff: string | null;
  tailgate: string | null;
  home: boolean;
  hasTribe: boolean;
  facebook: string | null;
  note?: string;
  trophy?: string;
};

export const FACEBOOK_GROUP = "https://www.facebook.com/groups/tailgatetribe/";
export const FACEBOOK_EVENTS = "https://www.facebook.com/share/g/1Dp7rGwiKw/";

export const LOT = {
  name: "East of Lot 8",
  intersection: "NW corner of Pensacola Street & Varsity Drive",
  city: "Tallahassee, FL",
  detail:
    "Grassy area to the east of Lot 8. Look for the big inflatable tent with the gold T, spear, and Tailgate Tribe on the side — you cannot miss it.",
  lat: 30.4390911,
  lng: -84.3011454,
};

export const EVENTS: TribeEvent[] = [
  {
    id: "nmsu",
    opponent: "New Mexico State",
    nickname: "Aggies",
    date: "Aug 29",
    weekday: "Saturday",
    iso: "2026-08-29T12:00:00-04:00",
    kickoff: "7:00 PM ET",
    tailgate: "Noon",
    home: true,
    hasTribe: true,
    facebook: "https://www.facebook.com/share/1BsfnyKz7a/",
    note: "Season opener. Tent goes up at noon — stay through kickoff.",
  },
  {
    id: "smu",
    opponent: "SMU",
    nickname: "Mustangs",
    date: "Sep 7",
    weekday: "Monday",
    iso: "2026-09-07T12:00:00-04:00",
    kickoff: "7:30 PM ET",
    tailgate: "Noon",
    home: true,
    hasTribe: true,
    facebook: "https://www.facebook.com/share/1L7URfxUqV/",
    note: "Labor Day Monday night. Perfect excuse to take the afternoon.",
  },
  {
    id: "alabama",
    opponent: "Alabama",
    nickname: "Tide",
    date: "Sep 19",
    weekday: "Saturday",
    iso: "2026-09-19T08:00:00-04:00",
    kickoff: "3:30 PM ET",
    tailgate: "8:00 AM",
    home: false,
    hasTribe: true,
    facebook: "https://www.facebook.com/share/1CG9AQDxCs/",
    note: "Road Tribe. Early meet-up — details and exact spot posted on Facebook.",
    trophy: "Away",
  },
  {
    id: "cark",
    opponent: "Central Arkansas",
    nickname: "Bears",
    date: "Sep 26",
    weekday: "Saturday",
    iso: "2026-09-26T12:00:00-04:00",
    kickoff: null,
    tailgate: null,
    home: true,
    hasTribe: true,
    facebook: "https://www.facebook.com/share/18dvwR5sF9/",
    note: "Kickoff still TBA. Tent is going up either way.",
  },
  {
    id: "virginia",
    opponent: "Virginia",
    nickname: "Cavaliers",
    date: "Oct 3",
    weekday: "Saturday",
    iso: "2026-10-03T12:00:00-04:00",
    kickoff: null,
    tailgate: null,
    home: true,
    hasTribe: true,
    facebook: "https://www.facebook.com/share/1EN998erJo/",
    trophy: "Jefferson–Eppes Trophy",
  },
  {
    id: "louisville",
    opponent: "Louisville",
    nickname: "Cardinals",
    date: "Oct 9",
    weekday: "Friday",
    iso: "2026-10-09T19:00:00-04:00",
    kickoff: "7:00 PM ET",
    tailgate: null,
    home: false,
    hasTribe: false,
    facebook: null,
  },
  {
    id: "miami",
    opponent: "Miami",
    nickname: "Canes",
    date: "Oct 17",
    weekday: "Saturday",
    iso: "2026-10-17T12:00:00-04:00",
    kickoff: null,
    tailgate: null,
    home: false,
    hasTribe: false,
    facebook: null,
    trophy: "Rivalry",
  },
  {
    id: "clemson",
    opponent: "Clemson",
    nickname: "Tigers",
    date: "Oct 31",
    weekday: "Saturday",
    iso: "2026-10-31T12:00:00-04:00",
    kickoff: null,
    tailgate: null,
    home: true,
    hasTribe: true,
    facebook: "https://www.facebook.com/share/1BQ7zTaraq/",
    note: "Halloween home rivalry. Costumes welcome if they stay family-friendly.",
    trophy: "Rivalry",
  },
  {
    id: "bc",
    opponent: "Boston College",
    nickname: "Eagles",
    date: "Nov 7",
    weekday: "Saturday",
    iso: "2026-11-07T12:00:00-04:00",
    kickoff: null,
    tailgate: null,
    home: false,
    hasTribe: false,
    facebook: null,
  },
  {
    id: "pitt",
    opponent: "Pittsburgh",
    nickname: "Panthers",
    date: "Nov 13",
    weekday: "Friday",
    iso: "2026-11-13T19:00:00-04:00",
    kickoff: "7:00 PM ET",
    tailgate: null,
    home: false,
    hasTribe: false,
    facebook: null,
  },
  {
    id: "ncstate",
    opponent: "NC State",
    nickname: "Wolfpack",
    date: "Nov 21",
    weekday: "Saturday",
    iso: "2026-11-21T12:00:00-05:00",
    kickoff: null,
    tailgate: null,
    home: true,
    hasTribe: true,
    facebook: "https://www.facebook.com/share/14fyNw3FkwR/",
  },
  {
    id: "florida",
    opponent: "Florida",
    nickname: "Floriduh",
    date: "Nov 27",
    weekday: "Friday",
    iso: "2026-11-27T10:30:00-05:00",
    kickoff: "3:30 PM ET",
    tailgate: "10:30 AM",
    home: true,
    hasTribe: true,
    facebook: "https://www.facebook.com/share/1CXZNhpbVH/",
    note: "Rivalry Friday. Come early. Stay loud.",
    trophy: "Rivalry",
  },
];

const TRIBE_WINDOW_MS = 6 * 60 * 60 * 1000;

export function getEvent(id: string) {
  return EVENTS.find((event) => event.id === id);
}

export function nextTribeEvent(now = Date.now()) {
  return EVENTS.find((event) => event.hasTribe && new Date(event.iso).getTime() + TRIBE_WINDOW_MS > now) ?? null;
}

export function kickoffLabel(event: TribeEvent) {
  return event.kickoff ?? "Kickoff TBA";
}

export function tentLabel(event: TribeEvent) {
  if (!event.hasTribe) return "No Tribe tent this week";
  return event.tailgate ? `Tent up ${event.tailgate}` : "Tent time TBA — typically noon";
}
