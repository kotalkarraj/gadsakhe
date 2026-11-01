import Link from "next/link";
import { requireAuthor } from "@/lib/auth";
import type { PostRow } from "@/lib/posts";
import { signOut } from "./actions";

type Props = { searchParams: Promise<{ deleted?: string }> };

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminHome({ searchParams }: Props) {
  const [{ deleted }, { supabase, userId, email, profile }] = await Promise.all([
    searchParams,
    requireAuthor(),
  ]);
  const isAdmin = profile.role === "admin";

  // Admins see every story; authors see their own
  let query = supabase
    .from("posts")
    .select("id, slug, name, code, area, status, trek_date, updated_at, author_name")
    .order("updated_at", { ascending: false });
  if (!isAdmin) query = query.eq("author_id", userId);
  const { data, error } = await query;
  const posts = (data ?? []) as Pick<
    PostRow,
    "id" | "slug" | "name" | "code" | "area" | "status" | "trek_date" | "updated_at" | "author_name"
  >[];

  const published = posts.filter((p) => p.status === "published").length;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-stat text-[11px] tracking-[0.3em] text-rust-text">
            {isAdmin ? "ADMIN" : "AUTHOR"} · {email}
          </p>
          <h1 className="mt-3 font-display text-5xl font-light tracking-tight">
            {isAdmin ? "All stories" : "Your stories"}
          </h1>
          <p className="mt-2 font-body text-sm text-dusk/50">
            {published} published · {posts.length - published} draft
            {posts.length - published === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <form action={signOut}>
            <button className="rounded-full px-4 py-2.5 font-body text-sm text-dusk/60 ring-1 ring-dusk/15 transition hover:text-dusk hover:ring-dusk/40">
              Sign out
            </button>
          </form>
          <Link
            href="/admin/posts/new"
            className="btn-primary rounded-full bg-dusk px-5 py-2.5 font-body text-sm font-medium text-limestone hover:text-dusk"
          >
            + New story
          </Link>
        </div>
      </div>

      {deleted && (
        <p className="fade-up rounded-2xl bg-white/70 px-5 py-3 font-body text-sm ring-1 ring-dusk/10">
          Story deleted.
        </p>
      )}
      {error && (
        <p className="rounded-2xl bg-red-50 px-5 py-3 font-body text-sm text-red-800 ring-1 ring-red-200">
          Couldn&apos;t load stories: {error.message}. Did you run supabase/schema.sql?
        </p>
      )}

      {posts.length === 0 && !error ? (
        <div className="rounded-3xl border border-dashed border-dusk/20 py-20 text-center">
          <p className="font-display text-3xl italic">No stories yet.</p>
          <p className="mt-2 font-body text-sm text-dusk/60">
            Write your first trek story — it stays a draft until you publish it.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-dusk/10 overflow-hidden rounded-3xl bg-white/60 ring-1 ring-dusk/10">
          {posts.map((post, i) => (
            <li key={post.id} className="fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <Link
                href={`/admin/posts/${post.id}`}
                className="group flex flex-col gap-2 px-6 py-5 transition-colors hover:bg-white sm:flex-row sm:items-center sm:gap-6"
              >
                <span
                  className={`w-fit rounded-full px-2.5 py-1 font-stat text-[10px] tracking-[0.2em] ${
                    post.status === "published"
                      ? "bg-rust/15 text-rust-text"
                      : "bg-brass/30 text-dusk/70"
                  }`}
                >
                  {post.status === "published" ? "LIVE" : "DRAFT"}
                </span>
                <span className="flex-1">
                  <span className="block font-display text-xl tracking-tight group-hover:text-rust-text transition-colors">
                    {post.name}
                  </span>
                  <span className="block font-body text-xs text-dusk/50">
                    {[post.code, post.area, post.author_name].filter(Boolean).join(" · ")}
                  </span>
                </span>
                <span className="font-stat text-[11px] text-dusk/40">
                  Edited {formatDate(post.updated_at)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
