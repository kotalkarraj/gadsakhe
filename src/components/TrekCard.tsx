"use client";

import Link from "next/link";
import type { Trek } from "@/data/treks";
import TrekImage from "@/components/TrekImage";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Editorial trek card: image (morphs into the post banner on click), a
 * brass spotlight that follows the pointer, and meta that slides in on
 * hover.
 */
export default function TrekCard({
  trek,
  tall = false,
}: {
  trek: Trek;
  tall?: boolean;
}) {
  return (
    <Link
      href={`/blogs/${trek.slug}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={`spotlight card-lift group relative block overflow-hidden rounded-2xl bg-canopy ${
        tall ? "h-[26rem] sm:h-full sm:min-h-[30rem]" : "h-[22rem]"
      }`}
    >
      <TrekImage trek={trek} />

      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-dusk via-dusk/40 to-transparent transition-opacity duration-700 group-hover:opacity-90" />
      <div className="absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-dusk/60 to-transparent" />

      <div className="relative z-[3] flex h-full flex-col justify-between p-6 text-limestone">
        <div className="flex items-center justify-between font-stat text-[11px] tracking-[0.18em] uppercase">
          <span className="rounded-full bg-dusk/40 px-3 py-1 text-brass ring-1 ring-brass/30 backdrop-blur">
            {trek.code}
          </span>
          <span className="text-limestone/70">{formatDate(trek.date)}</span>
        </div>

        <div>
          <p className="font-stat text-[11px] tracking-[0.18em] uppercase text-moss mb-2">
            {trek.area} · {trek.difficulty}
          </p>
          <h3
            className={`font-display leading-[1.05] tracking-tight ${
              tall ? "text-3xl sm:text-4xl" : "text-2xl"
            }`}
          >
            {trek.name}
          </h3>
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <p className="pt-3 font-body text-sm leading-relaxed text-limestone/75 line-clamp-3">
                {trek.excerpt}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-5 border-t border-white/15 pt-4 font-stat text-xs text-limestone/80">
            <span>
              <span className="text-brass">ALT</span> {trek.stats.altitude}
            </span>
            <span>
              <span className="text-brass">DIST</span> {trek.stats.distance}
            </span>
            <span>
              <span className="text-brass">DUR</span> {trek.stats.duration}
            </span>
            <span className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-limestone text-dusk transition-transform duration-500 group-hover:-rotate-45">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
