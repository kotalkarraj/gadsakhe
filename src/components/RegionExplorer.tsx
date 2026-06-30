"use client";

import { useState } from "react";
import { MACRO_REGIONS, getAreasForRegion, type MacroRegion } from "@/data/treks";

export default function RegionExplorer() {
  const [activeRegion, setActiveRegion] = useState<MacroRegion>(
    MACRO_REGIONS[0]
  );
  const [query, setQuery] = useState("");

  const areas = getAreasForRegion(activeRegion);
  const filteredAreas = query
    ? areas.filter((a) => a.toLowerCase().includes(query.toLowerCase()))
    : areas;

  return (
    <section className="bg-limestone px-6 sm:px-10 py-14">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-xl sm:text-2xl text-dusk tracking-wide mb-8">
          EXPLORE BY REGION
        </h2>

        {/* Search bar */}
        <div className="relative mb-8">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dusk/40 font-stat text-sm">
            ⌕
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Where are you heading?"
            className="w-full bg-canopy/5 border border-moss/30 rounded-lg pl-11 pr-4 py-3 font-body text-dusk placeholder:text-dusk/40 focus:outline-none focus:border-rust transition-colors"
          />
        </div>

        {/* Region tabs */}
        <div className="flex gap-8 border-b border-moss/25 mb-8">
          {MACRO_REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => {
                setActiveRegion(region);
                setQuery("");
              }}
              className={`relative pb-3 font-body text-base transition-colors ${
                activeRegion === region
                  ? "text-dusk"
                  : "text-dusk/50 hover:text-dusk/80"
              }`}
            >
              {region}
              {activeRegion === region && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-rust" />
              )}
            </button>
          ))}
        </div>

        {/* Areas within the active region */}
        {filteredAreas.length === 0 ? (
          <p className="font-body text-dusk/60 text-sm py-6">
            {areas.length === 0
              ? `No treks in ${activeRegion} yet — check back soon.`
              : "No areas match your search."}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredAreas.map((area) => (
              <a
                key={area}
                href={`/blogs?region=${encodeURIComponent(
                  activeRegion
                )}&area=${encodeURIComponent(area)}`}
                className="card-lift bg-canopy text-limestone rounded px-5 py-4 font-body text-sm"
              >
                {area}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
