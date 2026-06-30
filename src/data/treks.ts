// Placeholder trek data. Later, this will be replaced by a fetch from
// the database (Supabase) — every other file that imports from here
// won't need to change when that happens.

// Top-level region groupings (mountain ranges), independent of which
// treks currently exist in them — this lets us list "Himalayas" as a
// browsable/filterable region even before any Himalayan treks are added.
export const MACRO_REGIONS = ["Sahyadris", "Himalayas"] as const;
export type MacroRegion = (typeof MACRO_REGIONS)[number];

export type Trek = {
  slug: string;
  code: string;
  name: string;
  macroRegion: MacroRegion; // top-level grouping, e.g. "Sahyadris"
  area: string; // local sub-area/district, e.g. "Pune district"
  difficulty: "Easy" | "Moderate" | "Difficult";
  date: string;
  author: string;
  excerpt: string;
  image: string;
  stats: {
    altitude: string;
    distance: string;
    duration: string;
  };
  body: string[]; // paragraphs of the full story
  tips: string[]; // practical trek tips, shown in the sidebar card
};

export const treks: Trek[] = [
  {
    slug: "rajgad-monsoon-trail",
    code: "FORT 01",
    name: "Rajgad monsoon trail",
    macroRegion: "Sahyadris",
    area: "Pune district",
    difficulty: "Moderate",
    date: "2026-06-14",
    author: "Aisha Patil",
    excerpt:
      "Clouds rolled over the Bale Killa as we climbed through knee-deep grass, the trail slick from a week of rain.",
    image:
      "https://images.unsplash.com/photo-1673970825861-3469f8fe01d3?fm=jpg&q=70&w=1400&auto=format&fit=crop",
    stats: { altitude: "1340m", distance: "12km", duration: "6hr" },
    body: [
      "We started from Gunjavane base village a little after sunrise, the kind of grey monsoon morning where the hills look like they're breathing mist. Rajgad doesn't ease you in — the first hour is a steady climb through slick stone steps, and by the time we reached Chor Darwaza, everyone's shoes had given up being waterproof.",
      "The fort itself is enormous. Shivaji Maharaj's capital for over two decades, and you feel that scale once you're up on the Bale Killa — the citadel sits like its own separate fort above the rest of Rajgad, with a final scramble up wet rock to reach it.",
      "By midday the clouds finally broke just long enough for a clear view down into the Pali Darwaza side — entire valleys of green stretching out, terraced fields catching the light. It's the kind of view that makes the slipping and the soaked socks completely worth it.",
      "We started down by early afternoon, racing the next band of clouds rolling in. Made it to the base just as the rain started again — perfect timing, or beginner's luck.",
    ],
    tips: [
      "Best season: June–September, post-monsoon for clear views",
      "Carry grip shoes — the stone steps get dangerously slick",
      "Base village: Gunjavane, about 2hr from Pune",
      "Carry a rain cover for your bag and a spare pair of socks",
      "Bale Killa climb has exposed rock — not ideal for beginners",
      "Water sources available near Padmavati temple",
    ],
  },
  {
    slug: "harishchandragad-night-climb",
    code: "FORT 02",
    name: "Harishchandragad night climb",
    macroRegion: "Sahyadris",
    area: "Ahmednagar",
    difficulty: "Difficult",
    date: "2026-05-02",
    author: "Rohan Deshmukh",
    excerpt:
      "We started at midnight with four headlamps and a thermos of chai, hoping to catch the Konkan Kada sunrise.",
    image: "",
    stats: { altitude: "1424m", distance: "18km", duration: "10hr" },
    body: [
      "Night treks change everything about a trail. What's a clear, obvious path in daylight becomes a narrow cone of headlamp light and a lot of trust in whoever's walking in front. We left the base around midnight, four of us, mostly silent except for the occasional warning about loose rock.",
      "The Nalichi Vaat route is no joke even in daylight — steep, exposed in sections, with a fixed rope climb near the top that's a little more thrilling at 3am than it probably needed to be.",
      "We reached the plateau with maybe an hour to spare before sunrise, found a spot near the temple complex, and just sat in the dark drinking chai from a thermos that had somehow stayed warm the whole climb.",
      "Then the Konkan Kada did what it does — the cliff edge lit up gold as the sun came over the horizon, fog pooling in the valley below like it was filling up a bowl. Nobody said much. Some views just don't need commentary.",
    ],
    tips: [
      "Best attempted with a guide — the Nalichi Vaat route is steep and exposed",
      "Carry at least 2 reliable headlamps per person for the night climb",
      "Fixed rope section near the top — basic climbing comfort helps",
      "Pack extra layers, it gets cold on the plateau before sunrise",
    ],
  },
  {
    slug: "lohagad-after-the-rains",
    code: "FORT 03",
    name: "Lohagad after the rains",
    macroRegion: "Sahyadris",
    area: "Pune district",
    difficulty: "Easy",
    date: "2026-04-20",
    author: "Aisha Patil",
    excerpt:
      "A first-timer's trek — easy steps, sweeping valley views, and far too many photos of the Vinchu Kata.",
    image: "",
    stats: { altitude: "1033m", distance: "6km", duration: "3hr" },
    body: [
      "If you're bringing someone on their first trek, Lohagad is the answer. The path is mostly stone steps, well-marked, and short enough that you're at the top before anyone's legs have a real complaint.",
      "We went a week after the first good rain of the season, so everything was that impossible shade of green you only get in the Sahyadris in April — waterfalls that don't exist in summer were running along the cliff faces on the drive up.",
      "The Vinchu Kata — the scorpion-tail spur jutting out from the fort — is the obvious highlight, and we spent way too long out there taking photos with the valley dropping away on both sides.",
      "Total time including snack breaks and an embarrassing number of photo stops: about three hours. Perfect half-day trek if you want the Sahyadri feeling without committing a whole weekend to it.",
    ],
    tips: [
      "Great for beginners and families — well-marked stone steps",
      "Visit right after monsoon for waterfalls along the drive up",
      "Don't skip the Vinchu Kata viewpoint — easy walk, best views",
    ],
  },
];
