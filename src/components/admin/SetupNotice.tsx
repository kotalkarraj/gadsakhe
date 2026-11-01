export default function SetupNotice() {
  return (
    <div className="rounded-3xl bg-white/60 p-8 ring-1 ring-dusk/10">
      <p className="font-stat text-[11px] tracking-[0.25em] text-rust-text">SETUP NEEDED</p>
      <h1 className="mt-3 font-display text-4xl font-light tracking-tight">
        Connect the database
      </h1>
      <p className="mt-4 max-w-xl font-body text-dusk/70 leading-relaxed">
        The admin area needs a Supabase project. Follow the steps in{" "}
        <code className="rounded bg-dusk/5 px-1.5 py-0.5 font-stat text-sm">supabase/README.md</code>,
        put the project URL and publishable key in{" "}
        <code className="rounded bg-dusk/5 px-1.5 py-0.5 font-stat text-sm">.env.local</code>, then
        restart the dev server.
      </p>
      <p className="mt-4 max-w-xl font-body text-sm text-dusk/50">
        Until then the public site keeps showing the placeholder stories.
      </p>
    </div>
  );
}
