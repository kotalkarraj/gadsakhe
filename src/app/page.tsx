import Hero from "@/components/Hero";
import ScrollReveal from "@/components/ScrollReveal";
import RegionExplorer from "@/components/RegionExplorer";
import { treks } from "@/data/treks";

export default function Home() {
  // Later: this will be the latest/featured post pulled from the database.
  const featured = treks[0];

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
          { label: "ALT", value: featured.stats.altitude },
          { label: "DIST", value: featured.stats.distance },
          { label: "DUR", value: featured.stats.duration },
        ]}
        ctaLabel="Read the latest story →"
        ctaHref={`/blogs/${featured.slug}`}
      />

      {/* Featured treks */}
      <section className="bg-limestone px-6 sm:px-10 py-14 max-w-5xl mx-auto w-full">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-xl sm:text-2xl text-dusk tracking-wide">
            RECENT TRAILS
          </h2>
          <a
            href="/blogs"
            className="link-grow font-body text-sm text-rust-text"
          >
            View all →
          </a>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {treks.map((trek, i) => (
            <ScrollReveal key={trek.slug} delayMs={i * 80}>
              <a
                href={`/blogs/${trek.slug}`}
                className="card-lift block relative rounded overflow-hidden h-40"
              >
                <div className="absolute inset-0 bg-canopy" />
                {trek.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={trek.image}
                    alt={trek.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-canopy/80" />
                <div className="relative p-5 h-full flex flex-col justify-between text-limestone">
                  <div className="font-stat text-xs text-brass tracking-wider">
                    {trek.code}
                  </div>
                  <div>
                    <div className="font-body text-lg leading-snug mb-1">
                      {trek.name}
                    </div>
                    <div className="font-body text-sm text-moss">
                      {trek.area} · {trek.difficulty}
                    </div>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <RegionExplorer />
    </main>
  );
}
