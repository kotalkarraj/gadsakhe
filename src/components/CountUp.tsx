"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a value like "1340m" up from zero when it scrolls into view,
 * keeping any non-numeric suffix ("m", "km", "hr") as-is.
 */
export default function CountUp({
  value,
  durationMs = 1600,
  className = "",
}: {
  value: string;
  durationMs?: number;
  className?: string;
}) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;
    let raf = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 4);
        setN(target * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);

  if (!match) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {Math.round(n)}
      {suffix}
    </span>
  );
}
