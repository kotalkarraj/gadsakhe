"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { DIFFICULTIES, MACRO_REGIONS } from "@/data/treks";
import { requireAuthor } from "@/lib/auth";
import { IMAGE_BUCKET } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; message?: string };

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function sendMagicLink(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Only accounts an admin has added can sign in
      shouldCreateUser: false,
      emailRedirectTo: `${origin}/auth/callback?next=/admin`,
    },
  });

  if (error) {
    // Don't reveal whether an account exists for this email
    console.error("Sign-in link failed:", error.message);
  }
  return {
    message:
      "If that email belongs to a Gadsakhe author, a sign-in link is on its way. Check your inbox.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function refreshPublicPages(...slugs: (string | null | undefined)[]) {
  revalidatePath("/");
  revalidatePath("/blogs");
  for (const slug of slugs) if (slug) revalidatePath(`/blogs/${slug}`);
}

// Path of an uploaded image inside our bucket, from its public URL
function storagePathFromUrl(url: string) {
  const marker = `/storage/v1/object/public/${IMAGE_BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

export async function savePost(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const { supabase, userId, profile } = await requireAuthor();

  const field = (name: string) => String(formData.get(name) ?? "").trim();
  const id = field("id");
  const name = field("name");
  const area = field("area");
  const macroRegion = field("macro_region");
  const difficulty = field("difficulty");
  const slug = slugify(field("slug") || name);
  const status = formData.get("intent") === "publish" ? "published" : "draft";

  if (!name) return { error: "Give the story a title." };
  if (!slug) return { error: "The URL slug can only use letters and numbers." };
  if (!area) return { error: "Add the area (e.g. Pune)." };
  if (!(MACRO_REGIONS as readonly string[]).includes(macroRegion)) {
    return { error: "Pick a region." };
  }
  if (!(DIFFICULTIES as readonly string[]).includes(difficulty)) {
    return { error: "Pick a difficulty." };
  }

  // Paragraphs are separated by a blank line; tips are one per line
  const body = field("body")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
  const tips = field("tips")
    .split("\n")
    .map((t) => t.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);

  if (status === "published" && body.length === 0) {
    return { error: "Write the story before publishing (or save it as a draft)." };
  }

  // Image: new upload > keep existing > removed
  let imageUrl = field("existing_image_url");
  const oldImageUrl = imageUrl;
  if (formData.get("remove_image") === "on") imageUrl = "";

  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) return { error: "The cover must be an image file." };
    if (file.size > MAX_IMAGE_BYTES) return { error: "The cover image must be under 6 MB." };

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${userId}/${Date.now()}-${slug}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
    if (uploadError) return { error: `Image upload failed: ${uploadError.message}` };

    imageUrl = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  const values = {
    slug,
    name,
    area,
    macro_region: macroRegion,
    difficulty,
    code: field("code"),
    trek_date: field("trek_date") || new Date().toISOString().slice(0, 10),
    author_name: field("author_name") || profile.display_name,
    excerpt: field("excerpt"),
    altitude: field("altitude"),
    distance: field("distance"),
    duration: field("duration"),
    image_url: imageUrl,
    body,
    tips,
    status,
  };

  let savedId = id;
  let previousSlug: string | null = null;

  if (id) {
    const { data: existing } = await supabase
      .from("posts")
      .select("slug")
      .eq("id", id)
      .maybeSingle();
    previousSlug = existing?.slug ?? null;

    const { data, error } = await supabase
      .from("posts")
      .update(values)
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) return { error: friendlyDbError(error) };
    if (!data) return { error: "You don't have permission to edit this story." };
  } else {
    const { data, error } = await supabase
      .from("posts")
      .insert({ ...values, author_id: userId })
      .select("id")
      .single();
    if (error) return { error: friendlyDbError(error) };
    savedId = data.id;
  }

  // Clean up a replaced/removed cover we uploaded earlier
  if (oldImageUrl && oldImageUrl !== imageUrl) {
    const oldPath = storagePathFromUrl(oldImageUrl);
    if (oldPath) await supabase.storage.from(IMAGE_BUCKET).remove([oldPath]);
  }

  refreshPublicPages(slug, previousSlug);
  redirect(`/admin/posts/${savedId}?saved=${status}`);
}

export async function deletePost(formData: FormData) {
  const { supabase } = await requireAuthor();
  const id = String(formData.get("id") ?? "");

  const { data } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .select("slug, image_url")
    .maybeSingle();

  if (data) {
    const path = storagePathFromUrl(data.image_url);
    if (path) await supabase.storage.from(IMAGE_BUCKET).remove([path]);
    refreshPublicPages(data.slug);
  }
  redirect("/admin?deleted=1");
}

function friendlyDbError(error: { code?: string; message: string }) {
  if (error.code === "23505") {
    return "Another story already uses this URL slug — change the slug or title.";
  }
  if (error.code === "42501") {
    return "You don't have permission to do that.";
  }
  return error.message;
}
