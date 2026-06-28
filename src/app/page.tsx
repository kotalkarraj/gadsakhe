import Hero from "@/components/Hero";

const featuredTreks = [
  {
    code: "FORT 01",
    name: "Rajgad monsoon trail",
    region: "Pune district",
    difficulty: "Moderate",
    image:
      "https://images.unsplash.com/photo-1578869944808-57cd4a3bef7b?fm=jpg&q=70&w=1400&auto=format&fit=crop",
  },
  {
    code: "FORT 02",
    name: "Harishchandragad night climb",
    region: "Ahmednagar",
    difficulty: "Difficult",
    image: "/images/treks/harishchandragad-aerial.jpg",
  },
  {
    code: "FORT 03",
    name: "Lohagad after the rains",
    region: "Pune district",
    difficulty: "Easy",
    image: "/images/treks/lohagad-aerial.jpg",
  },
];

export default function Home() {
  // Later: this will be the latest/featured post pulled from the database.
  const featured = featuredTreks[0];

  return (
    <main className="flex flex-col">
      <Hero
        imageSrc={featured.image}
        imageAlt={`Aerial view of ${featured.name}`}
        title="GADSAKHE"
        subtitleNative="गडसखे"
        subtitleTranslation="companion of the forts"
        tagline="TREK STORIES FROM THE SAHYADRIS"
        stats={[
          { label: "ALT", value: "1340m" },
          { label: "DIST", value: "12km" },
          { label: "DUR", value: "6hr" },
        ]}
        ctaLabel="Read the latest story →"
        ctaHref="/blogs"
      />

      {/* Featured treks */}
      <section className="bg-limestone px-6 sm:px-10 py-14 max-w-5xl mx-auto w-full">
        <h2 className="font-display text-xl sm:text-2xl text-dusk mb-8 tracking-wide">
          RECENT TRAILS
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {featuredTreks.map((trek) => (
            <a
              key={trek.code}
              href="/blogs"
              className="block relative rounded overflow-hidden h-40 group"
            >
              <div className="absolute inset-0 bg-canopy" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trek.image}
                alt={trek.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-canopy/80 group-hover:bg-canopy/70 transition-colors" />
              <div className="relative p-5 h-full flex flex-col justify-between text-limestone">
                <div className="font-stat text-xs text-brass tracking-wider">
                  {trek.code}
                </div>
                <div>
                  <div className="font-body text-lg leading-snug mb-1">
                    {trek.name}
                  </div>
                  <div className="font-body text-sm text-moss">
                    {trek.region} · {trek.difficulty}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
