import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedTrek, getPublishedTreks } from "@/lib/posts";
import TrekImage from "@/components/TrekImage";
import ScrollReveal from "@/components/ScrollReveal";
import CountUp from "@/components/CountUp";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Pre-builds a static page for every published trek at build time (good
// for SEO). Posts published later render on first visit, and saving a post
// in /admin refreshes its page.
export const revalidate = 60;

export async function generateStaticParams() {
  const treks = await getPublishedTreks();
  return treks.map((trek) => ({ slug: trek.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [trek, treks] = await Promise.all([
    getPublishedTrek(slug),
    getPublishedTreks(),
  ]);

  if (!trek) {
    notFound();
  }

  const index = treks.findIndex((t) => t.slug === slug);
  const next = treks[(index + 1) % treks.length] ?? trek;
  const readMins = Math.max(
    1,
    Math.round(trek.body.join(" ").split(/\s+/).length / 200)
  );

  return (
    <main className="flex flex-col">
      {/* Full-bleed banner — the card image morphs into this */}
      <section className="relative flex min-h-[78svh] items-end overflow-hidden bg-dusk text-limestone">
        <TrekImage trek={trek} />
        <div className="absolute inset-0 bg-gradient-to-t from-dusk via-dusk/50 to-dusk/20" />

        <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-10 pt-40 pb-16">
          <p className="fade-up mb-6 flex flex-wrap items-center gap-3 font-stat text-[11px] tracking-[0.25em] text-brass">
            <span className="rounded-full bg-dusk/40 px-3 py-1 ring-1 ring-brass/30 backdrop-blur">
              {trek.code}
            </span>
            <span className="text-moss">
              {trek.macroRegion.toUpperCase()} · {trek.area.toUpperCase()} ·{" "}
              {trek.difficulty.toUpperCase()}
            </span>
          </p>
          <h1 className="font-display font-light text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.92] tracking-[-0.03em] max-w-4xl">
            {trek.name.split(" ").map((word, i) => (
              <span key={i} className="mask-line mr-[0.22em]">
                <span style={{ animationDelay: `${120 + i * 80}ms` }}>{word}</span>
              </span>
            ))}
          </h1>
          <p
            className="fade-up mt-8 flex flex-wrap gap-x-6 gap-y-2 font-stat text-xs tracking-[0.15em] text-limestone/70"
            style={{ animationDelay: "600ms" }}
          >
            <span>BY {trek.author.toUpperCase()}</span>
            <span>{formatDate(trek.date).toUpperCase()}</span>
            <span>{readMins} MIN READ</span>
          </p>
        </div>
      </section>

      {/* Stat strip */}
      <section className="border-b border-dusk/10 px-6 sm:px-10">
        <dl className="mx-auto grid max-w-6xl grid-cols-3">
          {[
            { label: "ALTITUDE", value: trek.stats.altitude },
            { label: "DISTANCE", value: trek.stats.distance },
            { label: "DURATION", value: trek.stats.duration },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`py-8 ${i > 0 ? "border-l border-dusk/10 pl-4 sm:pl-8" : ""}`}
            >
              <dt className="font-stat text-[10px] tracking-[0.25em] text-dusk/50">
                {s.label}
              </dt>
              <dd className="mt-2 font-display text-3xl sm:text-5xl font-light tracking-tight">
                <CountUp value={s.value} durationMs={1200} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Story + tips */}
      <section className="px-6 sm:px-10 py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 lg:flex-row lg:gap-20">
          <article className="min-w-0 flex-1">
            <div className="flex max-w-2xl flex-col gap-7">
              {trek.body.map((paragraph, i) => (
                <ScrollReveal key={i}>
                  <p
                    className={`font-body text-lg leading-[1.8] text-dusk/85 ${
                      i === 0 ? "drop-cap text-xl text-dusk" : ""
                    }`}
                  >
                    {paragraph}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          </article>

          {trek.tips.length > 0 && (
            <aside className="w-full lg:w-80 shrink-0">
              <div className="lg:sticky lg:top-28">
                <ScrollReveal>
                  <div className="relative overflow-hidden rounded-3xl bg-canopy p-7 text-limestone">
                    <svg
                      className="absolute inset-0 h-full w-full pointer-events-none"
                      viewBox="0 0 300 300"
                      preserveAspectRatio="xMidYMax slice"
                      aria-hidden="true"
                    >
                      <g stroke="var(--limestone)" strokeWidth="1" fill="none" opacity="0.07">
                        <path d="M -20 260 Q 80 230, 160 255 T 340 240" />
                        <path d="M -20 230 Q 90 200, 160 225 T 340 210" />
                        <path d="M -20 200 Q 100 170, 160 195 T 340 180" />
                        <path d="M -20 170 Q 110 145, 160 165 T 340 150" />
                      </g>
                    </svg>
                    <p className="relative font-stat text-[10px] tracking-[0.3em] text-brass">
                      FIELD NOTES
                    </p>
                    <ol className="relative mt-6 flex flex-col gap-5">
                      {trek.tips.map((tip, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="font-stat text-[11px] text-moss pt-0.5">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="font-body text-sm leading-relaxed text-limestone/85">
                            {tip}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </ScrollReveal>
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* Next story */}
      {next.slug !== trek.slug && (
        <section className="px-6 sm:px-10 pb-24">
          <div className="mx-auto max-w-6xl">
            <Link
              href={`/blogs/${next.slug}`}
              className="group relative flex items-end overflow-hidden rounded-3xl bg-dusk h-72 text-limestone"
            >
              <TrekImage trek={next} />
              <div className="absolute inset-0 bg-gradient-to-r from-dusk via-dusk/70 to-transparent transition-opacity duration-700 group-hover:opacity-80" />
              <div className="relative flex w-full items-end justify-between gap-6 p-8 sm:p-10">
                <div>
                  <p className="font-stat text-[10px] tracking-[0.3em] text-brass">
                    NEXT STORY
                  </p>
                  <p className="mt-3 font-display text-3xl sm:text-5xl font-light tracking-tight">
                    {next.name}
                  </p>
                </div>
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-limestone text-dusk text-xl transition-transform duration-500 group-hover:-rotate-45 group-hover:scale-110">
                  →
                </span>
              </div>
            </Link>
            <div className="mt-8">
              <Link href="/blogs" className="link-grow font-body text-sm text-rust-text">
                ← Back to all trek stories
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
