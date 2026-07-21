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
  initialRegion?: string;
  initialArea?: string;
};

const ALL = "All";

export default function TrekFilterableList({
  treks,
  initialRegion,
  initialArea,
}: Props) {
  const [macroRegion, setMacroRegion] = useState<string>(
    initialRegion || ALL
  );
  const [area, setArea] = useState<string>(initialArea || ALL);
  const [difficulty, setDifficulty] = useState<string>(ALL);

  // Region options come from the fixed MACRO_REGIONS list (not just
  // whatever treks currently exist), so e.g. "Himachal Pradesh" can show
  // up as a filter even before any treks there have been added yet.
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
      {/* Filters — hide region filter if it was pre-set from the homepage tab */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-start gap-6 sm:gap-10">

        {/* Region filter — only shown when browsing all treks, not when arriving from a region tab */}
        {!initialRegion && (
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
                    setArea(ALL);
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
        )}

        {/* Area filter — always shown, options narrow to the selected region */}
        <div className="flex flex-col gap-2">
          <span className="font-stat text-xs text-moss tracking-wider">
            {initialRegion ? `AREAS IN ${initialRegion.toUpperCase()}` : "AREA"}
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

        {/* Difficulty filter — always shown */}
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

      {/* Active region breadcrumb — shown when arriving from homepage region tab */}
      {initialRegion && (
        <div className="flex items-center gap-3 -mt-2">
          <span className="font-stat text-xs text-moss tracking-wider">SHOWING</span>
          <span className="font-body text-sm bg-canopy text-limestone px-3 py-1 rounded">
            {macroRegion}
          </span>
          <a
            href="/blogs"
            className="font-stat text-xs text-dusk/40 hover:text-rust-text transition-colors tracking-wider"
          >
            ✕ clear
          </a>
        </div>
      )}

      {/* Result count */}
      <p className="font-stat text-xs text-moss tracking-wider">
        {filtered.length} {filtered.length === 1 ? "RESULT" : "RESULTS"}
      </p>

      {/* Grid — same card format as homepage */}
      {filtered.length === 0 ? (
        <p className="font-body text-dusk/70 py-12 text-center">
          No treks match these filters yet. Try a different combination.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((trek, i) => (
            <ScrollReveal key={trek.slug} delayMs={i * 80}>
              <a
                href={`/blogs/${trek.slug}`}
                className="card-lift block relative rounded overflow-hidden h-52 group"
              >
                {/* Background colour fallback */}
                <div className="absolute inset-0 bg-canopy" />

                {/* Trek photo */}
                {trek.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={trek.image}
                    alt={trek.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-canopy/75 group-hover:bg-canopy/65 transition-colors" />

                {/* Content */}
                <div className="relative p-5 h-full flex flex-col justify-between text-limestone">
                  {/* Top: code + date */}
                  <div className="flex items-center gap-3 font-stat text-xs text-brass tracking-wider">
                    <span>{trek.code}</span>
                    <span className="text-moss">{formatDate(trek.date)}</span>
                  </div>

                  {/* Bottom: name + meta */}
                  <div>
                    <h2 className="font-body text-lg leading-snug mb-1 group-hover:text-rust transition-colors">
                      {trek.name}
                    </h2>
                    <p className="font-body text-xs text-limestone/70 leading-relaxed mb-2 line-clamp-2">
                      {trek.excerpt}
                    </p>
                    <div className="font-stat text-xs text-moss flex flex-wrap gap-x-4 gap-y-1">
                      <span>{trek.area}</span>
                      <span>{trek.difficulty}</span>
                      <span>ALT {trek.stats.altitude}</span>
                    </div>
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
