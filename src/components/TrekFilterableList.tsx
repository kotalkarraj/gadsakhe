"use client";

import { useState, useMemo } from "react";
import { MACRO_REGIONS, type Trek } from "@/data/treks";
import ScrollReveal from "@/components/ScrollReveal";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type Props = {
  treks: Trek[];
};

const ALL = "All";

export default function TrekFilterableList({ treks }: Props) {
  const [macroRegion, setMacroRegion] = useState<string>(ALL);
  const [area, setArea] = useState<string>(ALL);
  const [difficulty, setDifficulty] = useState<string>(ALL);

  // Region options come from the fixed MACRO_REGIONS list (not just
  // whatever treks currently exist), so e.g. "Himalayas" can show up as a
  // filter even before any Himalayan treks have been added yet.
  const macroRegionOptions = [ALL, ...MACRO_REGIONS];

  // Area (district-level) options only make sense within the selected
  // region, and are still derived from the actual trek data.
  const areaOptions = useMemo(() => {
    const relevant =
      macroRegion === ALL
        ? treks
        : treks.filter((t) => t.macroRegion === macroRegion);
    return [ALL, ...Array.from(new Set(relevant.map((t) => t.area)))];
  }, [treks, macroRegion]);

  const difficulties = [ALL, "Easy", "Moderate", "Difficult"];

  const filtered = treks.filter(
    (t) =>
      (macroRegion === ALL || t.macroRegion === macroRegion) &&
      (area === ALL || t.area === area) &&
      (difficulty === ALL || t.difficulty === difficulty)
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 sm:gap-8">
        <div className="flex flex-col gap-2">
          <span className="font-stat text-xs text-moss tracking-wider">
            REGION
          </span>
          <div className="flex flex-wrap gap-2">
            {macroRegionOptions.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setMacroRegion(r);
                  setArea(ALL); // reset area when region changes
                }}
                className={`font-body text-sm px-3 py-1.5 rounded border transition-colors ${
                  macroRegion === r
                    ? "bg-rust text-dusk border-rust"
                    : "bg-transparent text-dusk border-moss/40 hover:border-rust"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-stat text-xs text-moss tracking-wider">
            AREA
          </span>
          <div className="flex flex-wrap gap-2">
            {areaOptions.map((a) => (
              <button
                key={a}
                onClick={() => setArea(a)}
                className={`font-body text-sm px-3 py-1.5 rounded border transition-colors ${
                  area === a
                    ? "bg-rust text-dusk border-rust"
                    : "bg-transparent text-dusk border-moss/40 hover:border-rust"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-stat text-xs text-moss tracking-wider">
            DIFFICULTY
          </span>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`font-body text-sm px-3 py-1.5 rounded border transition-colors ${
                  difficulty === d
                    ? "bg-rust text-dusk border-rust"
                    : "bg-transparent text-dusk border-moss/40 hover:border-rust"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="font-stat text-xs text-moss tracking-wider">
        {filtered.length} {filtered.length === 1 ? "RESULT" : "RESULTS"}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="font-body text-dusk/70 py-12 text-center">
          No treks match these filters yet. Try a different combination.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {filtered.map((trek, i) => (
            <ScrollReveal key={trek.slug} delayMs={i * 80}>
              <a
                href={`/blogs/${trek.slug}`}
                className="card-lift group flex flex-col sm:flex-row gap-5 bg-canopy rounded overflow-hidden"
              >
                {/* Image */}
                <div className="relative w-full sm:w-72 h-48 sm:h-auto flex-shrink-0 bg-dusk">
                  {trek.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={trek.image}
                      alt={trek.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between p-5 sm:p-6 text-limestone flex-1">
                  <div>
                    <div className="flex items-center gap-3 font-stat text-xs text-brass tracking-wider mb-2">
                      <span>{trek.code}</span>
                      <span className="text-moss">
                        {formatDate(trek.date)}
                      </span>
                    </div>
                    <h2 className="font-body text-xl sm:text-2xl leading-snug mb-2 group-hover:text-rust transition-colors">
                      {trek.name}
                    </h2>
                    <p className="font-body text-sm text-limestone/80 leading-relaxed">
                      {trek.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 font-stat text-xs text-moss">
                    <span>{trek.macroRegion}</span>
                    <span>{trek.area}</span>
                    <span>{trek.difficulty}</span>
                    <span>ALT {trek.stats.altitude}</span>
                    <span>DIST {trek.stats.distance}</span>
                    <span>DUR {trek.stats.duration}</span>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
