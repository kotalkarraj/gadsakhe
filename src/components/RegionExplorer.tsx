"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import {
  MACRO_REGIONS,
  getAreasForRegion,
  type MacroRegion,
  type Trek,
} from "@/data/treks";

export default function RegionExplorer({ treks }: { treks: Trek[] }) {
  const [activeRegion, setActiveRegion] = useState<MacroRegion>(
    MACRO_REGIONS[0]
  );
  const [query, setQuery] = useState("");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  // Slide the highlight pill under whichever tab is active
  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[MACRO_REGIONS.indexOf(activeRegion)];
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeRegion]);

  const areas = getAreasForRegion(treks, activeRegion);
  const filteredAreas = query
    ? areas.filter((a) => a.toLowerCase().includes(query.toLowerCase()))
    : areas;

  return (
    <section id="regions" className="scroll-mt-24 bg-limestone px-6 sm:px-10 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <p className="font-stat text-[11px] tracking-[0.3em] text-rust-text mb-4">
              03 — EXPLORE
            </p>
            <h2 className="font-display text-4xl sm:text-6xl font-light tracking-tight leading-[0.95]">
              Where are you <span className="italic">heading?</span>
            </h2>
          </div>

          <div className="relative w-full lg:w-96">
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 text-dusk/40"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search an area…"
              className="w-full rounded-full border border-dusk/15 bg-white/50 py-3.5 pl-12 pr-5 font-body text-sm text-dusk placeholder:text-dusk/40 backdrop-blur transition-all duration-300 focus:border-rust focus:bg-white focus:outline-none focus:ring-4 focus:ring-rust/15"
            />
          </div>
        </div>

        {/* Region tabs with sliding pill */}
        <div className="relative mb-10 inline-flex rounded-full bg-dusk/5 p-1.5 ring-1 ring-dusk/10">
          <span
            className="absolute top-1.5 bottom-1.5 rounded-full bg-dusk shadow-lg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ left: pill.left, width: pill.width }}
          />
          {MACRO_REGIONS.map((region, i) => (
            <button
              key={region}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              onClick={() => {
                setActiveRegion(region);
                setQuery("");
              }}
              className={`relative z-10 rounded-full px-5 py-2 font-body text-sm transition-colors duration-300 ${
                activeRegion === region
                  ? "text-limestone"
                  : "text-dusk/60 hover:text-dusk"
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Areas — remount on region change so each one staggers in */}
        <div key={activeRegion}>
          {filteredAreas.length === 0 ? (
            <div className="fade-up flex flex-col items-start gap-2 rounded-2xl border border-dashed border-dusk/20 px-8 py-12">
              <p className="font-display text-2xl italic">
                {areas.length === 0 ? "Uncharted, for now." : "No match."}
              </p>
              <p className="font-body text-sm text-dusk/60">
                {areas.length === 0
                  ? `No treks in ${activeRegion} yet — check back soon.`
                  : "No areas match your search."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredAreas.map((area, i) => {
                const count = treks.filter(
                  (t) => t.macroRegion === activeRegion && t.area === area
                ).length;
                return (
                  <Link
                    key={area}
                    href={`/blogs?region=${encodeURIComponent(
                      activeRegion
                    )}&area=${encodeURIComponent(area)}`}
                    className="fade-up group relative overflow-hidden rounded-2xl bg-white/60 p-6 ring-1 ring-dusk/10 transition-all duration-500 hover:bg-dusk hover:text-limestone hover:ring-dusk"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-stat text-[10px] tracking-[0.25em] text-rust-text transition-colors group-hover:text-brass">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="translate-x-2 -translate-y-1 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
                        ↗
                      </span>
                    </div>
                    <p className="mt-10 font-display text-2xl tracking-tight">
                      {area}
                    </p>
                    <p className="mt-1 font-body text-xs text-dusk/50 transition-colors group-hover:text-limestone/60">
                      {count} {count === 1 ? "story" : "stories"}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
