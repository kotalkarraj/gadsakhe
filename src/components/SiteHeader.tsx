"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Stories" },
  { href: "/#regions", label: "Regions" },
];

/**
 * Floating glass header. Transparent over dark heroes, frosted once you
 * scroll, tucks away while scrolling down and returns on scroll up. A thin
 * brass bar along the top tracks how far down the page you are.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 240 && y > lastY.current);
      lastY.current = y;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        ref={progressRef}
        className="absolute left-0 top-0 h-0.5 w-full origin-left bg-brass"
        style={{ transform: "scaleX(0)" }}
      />
      <div className="px-4 sm:px-6 pt-3">
        <nav
          className={`mx-auto max-w-6xl flex items-center justify-between rounded-full pl-5 pr-2 py-2 transition-all duration-500 ${
            scrolled
              ? "bg-dusk/70 backdrop-blur-xl shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
              : "bg-transparent"
          }`}
        >
          <Link
            href="/"
            className="group flex items-baseline gap-2 text-limestone"
          >
            <span className="font-display text-lg tracking-tight">
              Gadsakhe
            </span>
            <span className="hidden sm:inline font-deva text-sm text-brass transition-transform duration-500 group-hover:-translate-y-0.5">
              गडसखे
            </span>
          </Link>

          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : !item.href.includes("#") && pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative block rounded-full px-2.5 sm:px-4 py-1.5 font-body text-[13px] transition-colors duration-300 ${
                      active
                        ? "bg-limestone text-dusk"
                        : "text-limestone/75 hover:text-limestone hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
