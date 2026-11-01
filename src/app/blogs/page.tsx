import { treks } from "@/data/treks";
import TrekFilterableList from "@/components/TrekFilterableList";

type Props = {
  searchParams: Promise<{ region?: string; area?: string }>;
};

export default async function BlogsPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <main className="flex flex-col">
      {/* Page header */}
      <section className="relative overflow-hidden bg-dusk px-6 sm:px-10 pt-40 pb-24 text-limestone">
        <svg
          className="contour absolute inset-0 h-full w-full"
          viewBox="0 0 680 300"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g stroke="var(--old-bell-brass)" strokeWidth="0.6" fill="none" opacity="0.25">
            <path d="M -20 260 Q 150 210, 340 250 T 700 230" />
            <path d="M -20 225 Q 160 175, 340 215 T 700 195" />
            <path d="M -20 190 Q 170 140, 340 180 T 700 160" />
            <path d="M -20 155 Q 180 110, 340 145 T 700 125" />
            <path d="M -20 120 Q 190 80, 340 110 T 700 95" />
          </g>
        </svg>
        <div className="mist left-[30%] top-[10%] h-72 w-[60%] bg-moss/10" />

        <div className="relative mx-auto max-w-6xl">
          <p className="fade-up mb-6 flex items-center gap-3 font-stat text-[11px] tracking-[0.3em] text-moss">
            <span className="grow-x inline-block h-px w-10 bg-moss" />
            {String(treks.length).padStart(2, "0")}{" "}
            {treks.length === 1 ? "STORY" : "STORIES"} FROM THE SAHYADRIS
          </p>
          <h1 className="font-display font-light text-[clamp(3rem,9vw,7rem)] leading-[0.9] tracking-[-0.03em]">
            <span className="mask-line">
              <span style={{ animationDelay: "100ms" }}>Trek</span>
            </span>{" "}
            <span className="mask-line">
              <span className="italic text-brass" style={{ animationDelay: "220ms" }}>
                stories
              </span>
            </span>
          </h1>
          <p
            className="fade-up mt-6 max-w-md font-body text-limestone/60"
            style={{ animationDelay: "500ms" }}
          >
            Filter by region, area or how hard you want your legs to hurt
            tomorrow.
          </p>
        </div>
      </section>

      {/* Filterable blog list */}
      <section className="px-6 sm:px-10 py-16">
        <div className="mx-auto max-w-6xl">
          <TrekFilterableList
            treks={treks}
            initialRegion={params.region}
            initialArea={params.area}
          />
        </div>
      </section>
    </main>
  );
}
