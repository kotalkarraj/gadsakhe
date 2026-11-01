import { ViewTransition } from "react";
import type { Trek } from "@/data/treks";
import TrekArt from "@/components/TrekArt";

/**
 * The trek's photo, or generative ridge art when there isn't one. Wrapped
 * in a named <ViewTransition> so the card image morphs into the story
 * banner when you open a post (and back again).
 */
export default function TrekImage({
  trek,
  className = "",
}: {
  trek: Trek;
  className?: string;
}) {
  return (
    <ViewTransition name={`trek-${trek.slug}`} share="morph">
      <div className={`absolute inset-0 overflow-hidden bg-canopy ${className}`}>
        {trek.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={trek.image}
            alt={trek.name}
            className="zoom-img absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <TrekArt
            seed={trek.slug}
            className="zoom-img absolute inset-0 w-full h-full"
          />
        )}
      </div>
    </ViewTransition>
  );
}
