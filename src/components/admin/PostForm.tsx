"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { DIFFICULTIES, MACRO_REGIONS } from "@/data/treks";
import type { PostRow } from "@/lib/posts";
import { deletePost, savePost, type FormState } from "@/app/admin/actions";

type Props = {
  post?: PostRow;
  defaultAuthor: string;
  saved?: "published" | "draft";
};

function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="font-stat text-[10px] tracking-[0.25em] text-dusk/50">{label}</span>
      {children}
      {hint && <span className="font-body text-xs text-dusk/40">{hint}</span>}
    </label>
  );
}

export default function PostForm({ post, defaultAuthor, saved }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePost, {});
  const [preview, setPreview] = useState(post?.image_url ?? "");
  const [removeImage, setRemoveImage] = useState(false);
  const isLive = post?.status === "published";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin" className="link-grow font-body text-sm text-rust-text">
          ← All stories
        </Link>
        {post && isLive && (
          <Link
            href={`/blogs/${post.slug}`}
            target="_blank"
            className="link-grow font-body text-sm text-dusk/60"
          >
            View live story ↗
          </Link>
        )}
      </div>

      <div>
        <p className="font-stat text-[11px] tracking-[0.3em] text-rust-text">
          {post ? (isLive ? "EDITING · LIVE" : "EDITING · DRAFT") : "NEW STORY"}
        </p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-light tracking-tight">
          {post?.name || "Untitled trek"}
        </h1>
      </div>

      {saved && !state.error && (
        <p className="fade-up rounded-2xl bg-canopy px-5 py-3 font-body text-sm text-limestone">
          {saved === "published" ? "Saved and published — it's live on the site." : "Draft saved."}
        </p>
      )}
      {state.error && (
        <p className="fade-up rounded-2xl bg-red-50 px-5 py-3 font-body text-sm text-red-800 ring-1 ring-red-200">
          {state.error}
        </p>
      )}

      <form action={action} className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <input type="hidden" name="id" value={post?.id ?? ""} />
        <input type="hidden" name="existing_image_url" value={post?.image_url ?? ""} />

        {/* Main column */}
        <div className="flex flex-col gap-6">
          <Field label="TITLE">
            <input
              name="name"
              required
              defaultValue={post?.name}
              placeholder="Rajgad monsoon trail"
              className="admin-input font-display !text-2xl"
            />
          </Field>
          <Field label="EXCERPT" hint="One or two sentences shown on story cards.">
            <textarea
              name="excerpt"
              rows={2}
              defaultValue={post?.excerpt}
              className="admin-input resize-y"
            />
          </Field>
          <Field label="STORY" hint="Leave a blank line between paragraphs.">
            <textarea
              name="body"
              rows={16}
              defaultValue={post?.body.join("\n\n")}
              placeholder="We started from the base village a little after sunrise…"
              className="admin-input resize-y leading-relaxed"
            />
          </Field>
          <Field label="TREK TIPS" hint="One tip per line.">
            <textarea
              name="tips"
              rows={5}
              defaultValue={post?.tips.join("\n")}
              placeholder={"Best season: June–September\nCarry grip shoes"}
              className="admin-input resize-y"
            />
          </Field>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 rounded-3xl bg-white/60 p-5 ring-1 ring-dusk/10">
            <button
              type="submit"
              name="intent"
              value="publish"
              disabled={pending}
              className="btn-primary rounded-full bg-dusk px-5 py-3 font-body text-sm font-medium text-limestone hover:text-dusk disabled:opacity-60"
            >
              {pending ? "Saving…" : isLive ? "Update live story" : "Publish"}
            </button>
            <button
              type="submit"
              name="intent"
              value="draft"
              disabled={pending}
              className="rounded-full px-5 py-3 font-body text-sm text-dusk/70 ring-1 ring-dusk/15 transition hover:text-dusk hover:ring-dusk/40 disabled:opacity-60"
            >
              {isLive ? "Unpublish (move to drafts)" : "Save draft"}
            </button>
          </div>

          <div className="flex flex-col gap-3 rounded-3xl bg-white/60 p-5 ring-1 ring-dusk/10">
            <span className="font-stat text-[10px] tracking-[0.25em] text-dusk/50">COVER IMAGE</span>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-canopy">
              {preview && !removeImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="absolute inset-0 grid place-items-center px-6 text-center font-body text-xs text-limestone/60">
                  No photo — the site draws a ridge illustration instead.
                </span>
              )}
            </div>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPreview(URL.createObjectURL(file));
                  setRemoveImage(false);
                }
              }}
              className="font-body text-xs text-dusk/60 file:mr-3 file:rounded-full file:border-0 file:bg-dusk file:px-4 file:py-2 file:text-xs file:text-limestone"
            />
            {post?.image_url && (
              <label className="flex items-center gap-2 font-body text-xs text-dusk/60">
                <input
                  type="checkbox"
                  name="remove_image"
                  checked={removeImage}
                  onChange={(e) => setRemoveImage(e.target.checked)}
                />
                Remove current image
              </label>
            )}
            <span className="font-body text-xs text-dusk/40">JPG/PNG/WebP, up to 6 MB.</span>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl bg-white/60 p-5 ring-1 ring-dusk/10">
            <Field label="REGION">
              <select
                name="macro_region"
                defaultValue={post?.macro_region ?? MACRO_REGIONS[0]}
                className="admin-input"
              >
                {MACRO_REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="AREA">
              <input name="area" required defaultValue={post?.area} placeholder="Pune" className="admin-input" />
            </Field>
            <Field label="DIFFICULTY">
              <select
                name="difficulty"
                defaultValue={post?.difficulty ?? "Moderate"}
                className="admin-input"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </Field>
            <Field label="TREK DATE">
              <input
                type="date"
                name="trek_date"
                defaultValue={post?.trek_date ?? new Date().toISOString().slice(0, 10)}
                className="admin-input"
              />
            </Field>
            <div className="grid grid-cols-3 gap-2">
              <Field label="ALT">
                <input name="altitude" defaultValue={post?.altitude} placeholder="1340m" className="admin-input !px-3" />
              </Field>
              <Field label="DIST">
                <input name="distance" defaultValue={post?.distance} placeholder="12km" className="admin-input !px-3" />
              </Field>
              <Field label="DUR">
                <input name="duration" defaultValue={post?.duration} placeholder="6hr" className="admin-input !px-3" />
              </Field>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl bg-white/60 p-5 ring-1 ring-dusk/10">
            <Field label="AUTHOR NAME">
              <input
                name="author_name"
                defaultValue={post?.author_name || defaultAuthor}
                className="admin-input"
              />
            </Field>
            <Field label="CODE" hint="Small label on cards, e.g. FORT 04.">
              <input name="code" defaultValue={post?.code} placeholder="FORT 04" className="admin-input" />
            </Field>
            <Field label="URL SLUG" hint="Leave blank to generate from the title.">
              <input
                name="slug"
                defaultValue={post?.slug}
                placeholder="rajgad-monsoon-trail"
                className="admin-input font-stat !text-sm"
              />
            </Field>
          </div>
        </div>
      </form>

      {post && (
        <form
          action={deletePost}
          onSubmit={(e) => {
            if (!confirm(`Delete "${post.name}" permanently? This can't be undone.`)) {
              e.preventDefault();
            }
          }}
          className="border-t border-dusk/10 pt-6"
        >
          <input type="hidden" name="id" value={post.id} />
          <button className="font-body text-sm text-red-700/80 transition hover:text-red-700">
            Delete this story
          </button>
        </form>
      )}
    </div>
  );
}
