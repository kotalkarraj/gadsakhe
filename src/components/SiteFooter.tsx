import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-dusk text-limestone">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 680 300"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g stroke="var(--monsoon-moss)" strokeWidth="0.6" fill="none" opacity="0.12">
          <path d="M -20 260 Q 150 210, 340 250 T 700 230" />
          <path d="M -20 220 Q 160 170, 340 210 T 700 190" />
          <path d="M -20 180 Q 170 130, 340 170 T 700 150" />
          <path d="M -20 140 Q 180 95, 340 130 T 700 110" />
        </g>
      </svg>

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10 pt-20 pb-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-3xl leading-tight">
              Every fort has a story.
              <span className="italic text-brass"> Walk it with us.</span>
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed text-limestone/60">
              A journal of fort treks, trails and monsoon stories from the
              Sahyadris — and slowly, the hills beyond.
            </p>
          </div>
          <nav className="flex gap-8 font-stat text-xs tracking-[0.2em]">
            <Link href="/" className="link-grow text-limestone/80 hover:text-limestone">
              HOME
            </Link>
            <Link href="/blogs" className="link-grow text-limestone/80 hover:text-limestone">
              STORIES
            </Link>
            <Link href="/#regions" className="link-grow text-limestone/80 hover:text-limestone">
              REGIONS
            </Link>
          </nav>
        </div>

        <p
          aria-hidden="true"
          className="text-outline mt-16 select-none font-display font-light leading-[0.8] tracking-[-0.05em] text-[clamp(4rem,19vw,16rem)]"
        >
          Gadsakhe
        </p>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-6 font-stat text-[11px] tracking-[0.18em] text-limestone/40 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} GADSAKHE</span>
          <span className="font-deva tracking-normal text-sm text-brass/70">
            गडसखे — companion of the forts
          </span>
        </div>
      </div>
    </footer>
  );
}
