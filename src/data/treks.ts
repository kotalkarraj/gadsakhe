// Placeholder trek data. Later, this will be replaced by a fetch from
// the database (Supabase) — every other file that imports from here
// won't need to change when that happens.

export type Trek = {
  slug: string;
  code: string;
  name: string;
  region: string;
  difficulty: "Easy" | "Moderate" | "Difficult";
  date: string;
  excerpt: string;
  image: string;
  stats: {
    altitude: string;
    distance: string;
    duration: string;
  };
};

export const treks: Trek[] = [
  {
    slug: "rajgad-monsoon-trail",
    code: "FORT 01",
    name: "Rajgad monsoon trail",
    region: "Pune district",
    difficulty: "Moderate",
    date: "2026-06-14",
    excerpt:
      "Clouds rolled over the Bale Killa as we climbed through knee-deep grass, the trail slick from a week of rain.",
    image:
      "https://images.unsplash.com/photo-1578869944808-57cd4a3bef7b?fm=jpg&q=70&w=1400&auto=format&fit=crop",
    stats: { altitude: "1340m", distance: "12km", duration: "6hr" },
  },
  {
    slug: "harishchandragad-night-climb",
    code: "FORT 02",
    name: "Harishchandragad night climb",
    region: "Ahmednagar",
    difficulty: "Difficult",
    date: "2026-05-02",
    excerpt:
      "We started at midnight with four headlamps and a thermos of chai, hoping to catch the Konkan Kada sunrise.",
    image: "",
    stats: { altitude: "1424m", distance: "18km", duration: "10hr" },
  },
  {
    slug: "lohagad-after-the-rains",
    code: "FORT 03",
    name: "Lohagad after the rains",
    region: "Pune district",
    difficulty: "Easy",
    date: "2026-04-20",
    excerpt:
      "A first-timer's trek — easy steps, sweeping valley views, and far too many photos of the Vinchu Kata.",
    image: "",
    stats: { altitude: "1033m", distance: "6km", duration: "3hr" },
  },
];
