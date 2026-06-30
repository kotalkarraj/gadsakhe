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
  return (
    <section className="relative overflow-hidden bg-dusk text-limestone">
      {/* Background photo (dynamic — pass imageSrc per trek/post) */}
      {imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Dark gradient overlay so text stays readable over any photo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(28,43,34,0.96) 0%, rgba(28,43,34,0.85) 35%, rgba(28,43,34,0.55) 70%, rgba(28,43,34,0.35) 100%)",
        }}
      />

      {/* Contour line texture, on top of photo + gradient */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 680 280"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g stroke="var(--canopy-shade)" strokeWidth="1.2" fill="none" opacity="0.7">
          <path d="M -20 230 Q 150 180, 340 220 T 700 200" />
          <path d="M -20 200 Q 160 150, 340 190 T 700 170" />
          <path d="M -20 170 Q 170 120, 340 160 T 700 140" />
          <path d="M -20 140 Q 180 95, 340 130 T 700 110" />
          <path d="M -20 110 Q 190 70, 340 100 T 700 85" />
          <path d="M -20 280 Q 140 240, 340 260 T 700 250" />
        </g>
      </svg>

      <div className="relative max-w-5xl mx-auto px-6 sm:px-10 pt-20 pb-16">
        <h1 className="fade-up delay-1 font-display text-4xl sm:text-6xl tracking-wide">
          {title}
        </h1>

        {(subtitleNative || subtitleTranslation) && (
          <p className="fade-up delay-2 mt-3 italic font-body text-rust text-base sm:text-lg">
            {subtitleNative}
            {subtitleNative && subtitleTranslation && " — "}
            {subtitleTranslation}
          </p>
        )}

        {tagline && (
          <p className="fade-up delay-3 mt-4 font-stat text-xs sm:text-sm tracking-widest text-moss">
            {tagline}
          </p>
        )}

        <div className="fade-up delay-3 mt-6 w-48 h-0.5 bg-rust" />

        {stats.length > 0 && (
          <div className="fade-up delay-4 mt-6 flex flex-wrap gap-x-8 gap-y-2 font-stat text-xs sm:text-sm text-brass">
            {stats.map((s) => (
              <span key={s.label}>
                {s.label} {s.value}
              </span>
            ))}
          </div>
        )}

        {ctaLabel && (
          <a
            href={ctaHref}
            className="fade-up delay-5 btn-primary inline-block mt-10 bg-rust text-dusk px-6 py-3 rounded font-body text-sm sm:text-base"
          >
            {ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}
