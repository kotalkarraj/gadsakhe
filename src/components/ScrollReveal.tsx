"use client";

import { useEffect, useRef, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

/**
 * Wraps any content so it fades, un-blurs and slides up into view the
 * first time it scrolls into the viewport. Doesn't re-trigger when you
 * scroll past it again.
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
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-fade ${className}`}
      style={{ "--reveal-delay": `${delayMs}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
