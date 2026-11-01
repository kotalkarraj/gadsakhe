"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MACRO_REGIONS, type Trek } from "@/data/treks";
import TrekCard from "@/components/TrekCard";

type Props = {
  treks: Trek[];
  initialRegion?: string;
  initialArea?: string;
};

const ALL = "All";

function Chips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-stat text-[10px] tracking-[0.25em] text-dusk/50">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-full px-4 py-1.5 font-body text-sm transition-all duration-300 active:scale-95 ${
              value === o
                ? "bg-dusk text-limestone shadow-md"
                : "bg-white/60 text-dusk/70 ring-1 ring-dusk/10 hover:text-dusk hover:ring-dusk/30"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

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

  // Changing any filter remounts the grid so the cards re-stagger in
  const gridKey = `${macroRegion}|${area}|${difficulty}`;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-8 rounded-3xl bg-white/40 p-6 sm:p-8 ring-1 ring-dusk/10 backdrop-blur sm:flex-row sm:flex-wrap sm:gap-12">
        {/* Region filter — only shown when browsing all treks, not when arriving from a region tab */}
        {!initialRegion && (
          <Chips
            label="REGION"
            options={macroRegionOptions}
            value={macroRegion}
            onChange={(r) => {
              setMacroRegion(r);
              setArea(ALL);
            }}
          />
        )}
        <Chips
          label={initialRegion ? `AREAS IN ${initialRegion.toUpperCase()}` : "AREA"}
          options={areaOptions}
          value={area}
          onChange={setArea}
        />
        <Chips
          label="DIFFICULTY"
          options={difficulties}
          value={difficulty}
          onChange={setDifficulty}
        />
      </div>

      <div className="flex items-center gap-4">
        <p className="font-stat text-[11px] tracking-[0.25em] text-dusk/50">
          <span className="text-dusk">{String(filtered.length).padStart(2, "0")}</span>{" "}
          {filtered.length === 1 ? "RESULT" : "RESULTS"}
        </p>
        {initialRegion && (
          <>
            <span className="rounded-full bg-dusk px-3 py-1 font-body text-xs text-limestone">
              {macroRegion}
            </span>
            <Link
              href="/blogs"
              className="font-stat text-[11px] tracking-[0.2em] text-dusk/40 transition-colors hover:text-rust-text"
            >
              ✕ CLEAR
            </Link>
          </>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="fade-up rounded-3xl border border-dashed border-dusk/20 py-20 text-center">
          <p className="font-display text-3xl italic">Nothing on this trail.</p>
          <p className="mt-2 font-body text-sm text-dusk/60">
            No treks match these filters yet. Try a different combination.
          </p>
        </div>
      ) : (
        <div key={gridKey} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((trek, i) => (
            <div
              key={trek.slug}
              className="fade-up"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <TrekCard trek={trek} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
