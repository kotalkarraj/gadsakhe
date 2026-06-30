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
      <section className="bg-dusk text-limestone px-6 sm:px-10 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-3xl sm:text-5xl tracking-wide">
            TREK STORIES
          </h1>
          <p className="mt-3 font-stat text-xs sm:text-sm tracking-widest text-moss">
            {treks.length} {treks.length === 1 ? "STORY" : "STORIES"} FROM THE
            SAHYADRIS
          </p>
          <div className="mt-6 w-48 h-0.5 bg-rust" />
        </div>
      </section>

      {/* Filterable blog list */}
      <section className="bg-limestone px-6 sm:px-10 py-14">
        <div className="max-w-5xl mx-auto">
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
