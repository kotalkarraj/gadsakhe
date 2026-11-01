import Link from "next/link";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ScrollReveal from "@/components/ScrollReveal";
import RegionExplorer from "@/components/RegionExplorer";
import TrekCard from "@/components/TrekCard";
import CountUp from "@/components/CountUp";
import { getPublishedTreks } from "@/lib/posts";

// Re-check the database at most once a minute; saving a post in /admin
// also refreshes these pages immediately.
export const revalidate = 60;

const num = (v: string) => parseFloat(v) || 0;

export default async function Home() {
  const treks = await getPublishedTreks();
  // Latest story with a photo leads the hero; falls back to the latest story
  const featured = treks.find((t) => t.image) ?? treks[0];
  const [lead, ...rest] = treks.slice(0, 3);

  const totalKm = treks.reduce((sum, t) => sum + num(t.stats.distance), 0);
  const highest = Math.max(0, ...treks.map((t) => num(t.stats.altitude)));

  return (
    <main className="flex flex-col">
      <Hero
        imageSrc={featured?.image}
        imageAlt={featured ? `Aerial view of ${featured.name}` : ""}
        title="Gadsakhe"
        subtitleNative="गडसखे"
        subtitleTranslation="companion of the forts"
        tagline="TREK STORIES FROM THE SAHYADRIS"
        stats={
          featured
            ? [
                { label: "ALT", value: featured.stats.altitude },
                { label: "DIST", value: featured.stats.distance },
                { label: "DUR", value: featured.stats.duration },
              ].filter((s) => s.value)
            : []
        }
        ctaLabel={featured ? "Read the latest story" : undefined}
        ctaHref={featured ? `/blogs/${featured.slug}` : undefined}
      />

      {/* Intro */}
      <section className="px-6 sm:px-10 pt-16 pb-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.4fr]">
          <ScrollReveal>
            <p className="font-stat text-[11px] tracking-[0.3em] text-rust-text">
              01 — THE JOURNAL
            </p>
          </ScrollReveal>
          <ScrollReveal delayMs={100}>
            <p className="font-display text-3xl sm:text-[2.6rem] font-light leading-[1.15] tracking-tight">
              Wet stone steps, chai at 3am, and clouds rolling over
              four-hundred-year-old ramparts.{" "}
              <span className="italic text-rust-text">
                Honest field notes from the forts of the Sahyadris
              </span>{" "}
              — written by the people who climbed them.
            </p>
          </ScrollReveal>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-3 border-t border-dusk/10">
          {[
            { value: `${treks.length}`, label: "Forts written up" },
            { value: `${totalKm}km`, label: "Trail covered" },
            { value: `${highest}m`, label: "Highest summit" },
          ].map((s, i) => (
            <ScrollReveal
              key={s.label}
              delayMs={i * 120}
              className={`pt-8 ${i > 0 ? "border-l border-dusk/10 pl-4 sm:pl-8" : ""}`}
            >
              <CountUp
                value={s.value}
                className="block font-display text-4xl sm:text-6xl font-light tracking-tight"
              />
              <span className="mt-2 block font-stat text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-dusk/50">
                {s.label}
              </span>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <Marquee items={treks.slice(0, 6).map((t) => t.name.split(" ")[0]).concat(["Sahyadri", "Monsoon", "Konkan Kada"])} />

      {/* Featured treks */}
      <section className="px-6 sm:px-10 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex items-end justify-between gap-6">
            <ScrollReveal>
              <p className="font-stat text-[11px] tracking-[0.3em] text-rust-text mb-4">
                02 — RECENT TRAILS
              </p>
              <h2 className="font-display text-4xl sm:text-6xl font-light tracking-tight leading-[0.95]">
                Fresh off <span className="italic">the ridge</span>
              </h2>
            </ScrollReveal>
            <Link
              href="/blogs"
              className="link-grow shrink-0 font-body text-sm text-rust-text"
            >
              View all stories →
            </Link>
          </div>

          {!lead && (
            <p className="rounded-3xl border border-dashed border-dusk/20 py-16 text-center font-display text-2xl italic">
              The first story is still on the trail.
            </p>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            {lead && (
              <ScrollReveal className="sm:row-span-2">
                <TrekCard trek={lead} tall />
              </ScrollReveal>
            )}
            {rest.map((trek, i) => (
              <ScrollReveal key={trek.slug} delayMs={(i + 1) * 120}>
                <TrekCard trek={trek} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <RegionExplorer treks={treks} />
    </main>
  );
}
