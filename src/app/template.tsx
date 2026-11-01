import { ViewTransition } from "react";

// A template remounts on every navigation, so wrapping it in a
// <ViewTransition> gives each page a soft fade/slide in and out. Named
// elements inside (trek images) morph on their own on top of this.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div className="flex-1 flex flex-col">{children}</div>
    </ViewTransition>
  );
}
