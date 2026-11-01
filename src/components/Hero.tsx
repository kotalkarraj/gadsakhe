"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

type HeroProps = {
  imageSrc?: string;
  imageAlt?: string;
  title: string;
  subtitleNative?: string;
  subtitleTranslation?: string;
  tagline?: string;
  stats?: { label: string; value: string }[];
  ctaLabel?: string;
  ctaHref?: string;
};

// Layered ridge silhouettes along the bottom of the hero. Each one moves
// at a different speed on scroll / pointer for a sense of depth.
const RIDGES = [
  {
    d: "M0 220 Q 120 150 240 190 T 480 170 T 720 200 T 960 160 T 1200 190 T 1440 170 L1440 320 L0 320 Z",
    fill: "rgba(95,143,108,0.35)",
    depth: 0.15,
  },
  {
    d: "M0 250 Q 160 190 300 230 T 620 210 T 900 240 T 1180 200 T 1440 230 L1440 320 L0 320 Z",
    fill: "rgba(47,90,64,0.7)",
    depth: 0.3,
  },
  {
    d: "M0 280 Q 200 230 380 265 T 760 250 T 1100 275 T 1440 255 L1440 320 L0 320 Z",
    fill: "var(--limestone)",
    depth: 0.08,
  },
];

export default function Hero({
  imageSrc,
  imageAlt = "",
  title,
  subtitleNative,
  subtitleTranslation,
  tagline,
  stats = [],
  ctaLabel,
  ctaHref = "#",
}: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let px = 0;
    let py = 0;
    let raf = 0;

    const apply = () => {
      raf = 0;
      const sy = window.scrollY;
      root.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
        const depth = parseFloat(el.dataset.depth || "0");
        el.style.transform = `translate3d(${px * depth * 30}px, ${
          -sy * depth + py * depth * 20
        }px, 0)`;
      });
      root.querySelectorAll<HTMLElement>("[data-fade]").forEach((el) => {
        el.style.opacity = String(Math.max(0, 1 - sy / 500));
        el.style.transform = `translate3d(0, ${sy * 0.25}px, 0)`;
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onPointer = (e: PointerEvent) => {
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
      schedule();
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("pointermove", onPointer);
    apply();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-dusk text-limestone"
    >
      {/* Background photo with a slow settle-in zoom */}
      {imageSrc && (
        <div data-depth="-0.2" className="absolute inset-[-6%] -z-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="ken-burns h-full w-full object-cover"
          />
        </div>
      )}

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_40%,rgba(14,23,18,0.55),rgba(14,23,18,0.92)_70%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-dusk/60 via-transparent to-dusk/30" />

      {/* Drifting monsoon mist */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="mist left-[-10%] top-[20%] h-72 w-[60%] bg-mist/15" />
        <div
          className="mist right-[-15%] top-[45%] h-96 w-[70%] bg-moss/10"
          style={{ animationDuration: "34s", animationDirection: "alternate-reverse" }}
        />
        <div
          className="mist left-[20%] bottom-[10%] h-64 w-[50%] bg-brass/10"
          style={{ animationDuration: "30s" }}
        />
      </div>

      {/* Contour lines that draw themselves in */}
      <svg
        className="contour absolute inset-0 -z-10 h-full w-full"
        viewBox="0 0 680 400"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g stroke="var(--old-bell-brass)" strokeWidth="0.6" fill="none" opacity="0.28">
          <path d="M -20 330 Q 150 280, 340 320 T 700 300" />
          <path d="M -20 295 Q 160 245, 340 285 T 700 265" />
          <path d="M -20 260 Q 170 210, 340 250 T 700 230" />
          <path d="M -20 225 Q 180 180, 340 215 T 700 195" />
          <path d="M -20 190 Q 190 150, 340 180 T 700 165" />
          <path d="M -20 155 Q 200 120, 340 145 T 700 135" />
          <path d="M -20 120 Q 210 90, 340 110 T 700 105" />
        </g>
      </svg>

      <div
        data-fade
        className="relative mx-auto w-full max-w-6xl px-6 sm:px-10 pt-32 pb-40"
      >
        {tagline && (
          <p className="fade-up mb-8 flex items-center gap-3 font-stat text-[11px] sm:text-xs tracking-[0.3em] text-moss">
            <span className="grow-x inline-block h-px w-10 bg-moss" />
            {tagline}
          </p>
        )}

        <h1 className="font-display font-light text-[clamp(3.5rem,13vw,10.5rem)] leading-[0.85] tracking-[-0.04em]">
          {title.split("").map((ch, i) => (
            <span key={i} className="mask-line">
              <span style={{ animationDelay: `${150 + i * 60}ms` }}>{ch}</span>
            </span>
          ))}
        </h1>

        {(subtitleNative || subtitleTranslation) && (
          <p
            className="fade-up mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1"
            style={{ animationDelay: "700ms" }}
          >
            {subtitleNative && (
              <span className="font-deva text-2xl sm:text-3xl text-brass">
                {subtitleNative}
              </span>
            )}
            {subtitleTranslation && (
              <span className="font-display italic text-lg sm:text-2xl text-limestone/70">
                {subtitleTranslation}
              </span>
            )}
          </p>
        )}

        <div className="mt-12 flex flex-col sm:flex-row sm:items-end gap-10 sm:gap-16">
          {ctaLabel && (
            <Link
              href={ctaHref}
              className="fade-up btn-primary inline-flex w-fit items-center gap-3 rounded-full bg-brass px-7 py-4 font-body text-sm font-medium text-dusk"
              style={{ animationDelay: "900ms" }}
            >
              {ctaLabel}
              <span className="arrow">→</span>
            </Link>
          )}

          {stats.length > 0 && (
            <dl
              className="fade-up flex gap-8 sm:gap-10"
              style={{ animationDelay: "1050ms" }}
            >
              {stats.map((s) => (
                <div key={s.label} className="border-l border-white/20 pl-4">
                  <dt className="font-stat text-[10px] tracking-[0.25em] text-moss">
                    {s.label}
                  </dt>
                  <dd className="mt-1 font-display text-2xl sm:text-3xl">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {/* Parallax ridges, the last one blends into the page below */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[22vh] sm:h-[38vh] sm:min-h-56">
        {RIDGES.map((r, i) => (
          <svg
            key={i}
            data-depth={-r.depth}
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="absolute inset-x-[-4%] bottom-[-2px] h-full w-[108%]"
            aria-hidden="true"
          >
            <path d={r.d} fill={r.fill} />
          </svg>
        ))}
      </div>

      {/* Scroll cue */}
      <div className="fade-up absolute bottom-10 right-6 sm:right-10 z-10 hidden sm:flex flex-col items-center gap-3 text-dusk/60" style={{ animationDelay: "1400ms" }}>
        <span className="font-stat text-[10px] tracking-[0.3em] [writing-mode:vertical-rl]">
          SCROLL
        </span>
        <span className="scroll-cue relative block h-12 w-px overflow-hidden bg-dusk/15" />
      </div>
    </section>
  );
}
