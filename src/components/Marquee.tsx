/**
 * Endless ticker of words. The list is rendered twice and the track slides
 * by exactly half its width, so the loop is seamless. Pauses on hover.
 */
export default function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-8 font-display text-3xl sm:text-5xl italic font-light tracking-tight text-dusk/85">
            {item}
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" className="text-rust" aria-hidden="true">
            <path d="M12 2 L22 22 L2 22 Z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee relative overflow-hidden border-y border-dusk/10 py-6 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
