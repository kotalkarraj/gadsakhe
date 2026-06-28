import { treks } from "@/data/treks";
import { notFound } from "next/navigation";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Pre-builds a static page for every trek at build time (good for SEO,
// and works fine with placeholder data now or real database data later).
export function generateStaticParams() {
  return treks.map((trek) => ({ slug: trek.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const trek = treks.find((t) => t.slug === slug);

  if (!trek) {
    notFound();
  }

  return (
    <main className="flex flex-col">
      {/* Full-width banner image with title overlay */}
      <section className="relative overflow-hidden bg-dusk text-limestone">
        {trek.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={trek.image}
            alt={trek.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Dark overlay so the title stays readable over any photo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(28,43,34,0.55) 0%, rgba(28,43,34,0.85) 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-24">
          <div className="font-stat text-xs text-brass tracking-wider mb-2">
            {trek.code}
          </div>
          <h1 className="font-display text-3xl sm:text-5xl tracking-wide">
            {trek.name.toUpperCase()}
          </h1>
          <p className="mt-2 font-stat text-xs text-moss tracking-widest">
            {trek.region.toUpperCase()} · {trek.difficulty.toUpperCase()}
          </p>
        </div>
      </section>

      {/* Two-column body: info card (left) + story (right) */}
      <section className="bg-limestone px-6 sm:px-10 py-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-12">
          {/* Info sidebar — scrolls normally with the page, not sticky */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="relative bg-canopy rounded overflow-hidden flex flex-col">
              {/* Small card photo (same image as banner, cropped square-ish) */}
              <div className="relative w-full h-40 bg-dusk flex-shrink-0">
                {trek.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={trek.image}
                    alt={trek.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Stats table */}
              <div className="relative p-5 text-limestone">
                <div className="font-stat text-xs text-brass tracking-wider mb-3">
                  TREK INFO
                </div>
                <dl className="flex flex-col gap-2.5 font-body text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-moss">Region</dt>
                    <dd className="text-right">{trek.region}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-moss">Difficulty</dt>
                    <dd className="text-right">{trek.difficulty}</dd>
                  </div>
                  <div className="h-px bg-moss/30 my-1" />
                  <div className="flex justify-between gap-3">
                    <dt className="text-moss">Altitude</dt>
                    <dd className="text-right font-stat">
                      {trek.stats.altitude}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-moss">Distance</dt>
                    <dd className="text-right font-stat">
                      {trek.stats.distance}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-moss">Duration</dt>
                    <dd className="text-right font-stat">
                      {trek.stats.duration}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Trek tips + contour texture filling remaining card height,
                  so short tip lists never leave visibly blank space */}
              <div className="relative flex-1 flex flex-col">
                {/* Contour-line texture, anchored to the bottom of the card,
                    fills whatever space is left below the tips */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 300 300"
                  preserveAspectRatio="xMidYMax slice"
                  aria-hidden="true"
                >
                  <g
                    stroke="var(--limestone)"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.08"
                  >
                    <path d="M -20 260 Q 80 230, 160 255 T 340 240" />
                    <path d="M -20 230 Q 90 200, 160 225 T 340 210" />
                    <path d="M -20 200 Q 100 170, 160 195 T 340 180" />
                    <path d="M -20 170 Q 110 145, 160 165 T 340 150" />
                    <path d="M -20 290 Q 70 265, 160 285 T 340 270" />
                  </g>
                </svg>

                {trek.tips.length > 0 && (
                  <div className="relative px-5 pb-5">
                    <div className="h-px bg-moss/30 mb-4" />
                    <div className="font-stat text-xs text-brass tracking-wider mb-3">
                      TREK TIPS
                    </div>
                    <ul className="flex flex-col gap-2.5">
                      {trek.tips.map((tip, i) => (
                        <li
                          key={i}
                          className="font-body text-xs leading-relaxed text-limestone pl-3.5 relative"
                        >
                          <span className="absolute left-0 text-brass">
                            ·
                          </span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Minimum height so the texture has room to show even
                    when tips are short */}
                <div className="min-h-16" />
              </div>
            </div>
          </aside>

          {/* Story column */}
          <article className="flex-1 min-w-0">
            <div className="flex items-center gap-3 font-stat text-xs text-moss tracking-wider mb-8 pb-6 border-b border-moss/20">
              <span>{trek.author}</span>
              <span>·</span>
              <span>{formatDate(trek.date)}</span>
            </div>

            <div className="flex flex-col gap-6 max-w-2xl">
              {trek.body.map((paragraph, i) => (
                <p
                  key={i}
                  className="font-body text-base sm:text-lg leading-relaxed text-dusk"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t border-moss/20 max-w-2xl">
              <a
                href="/blogs"
                className="font-body text-sm text-rust hover:underline"
              >
                ← Back to all trek stories
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
