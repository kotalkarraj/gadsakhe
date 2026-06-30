"use client";

import { useEffect, useRef, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

/**
 * Wraps any content so it fades + slides up into view the first time it
 * scrolls into the viewport. Used for trek cards on the homepage and
 * blogs listing so the page feels alive while scrolling, without
 * re-triggering every time you scroll past it again.
 */
export default function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delayMs) {
            setTimeout(() => el.classList.add("is-visible"), delayMs);
          } else {
            el.classList.add("is-visible");
          }
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div ref={ref} className={`scroll-fade ${className}`}>
      {children}
    </div>
  );
}
