import {
  MACRO_REGIONS,
  placeholderTreks,
  type Difficulty,
  type MacroRegion,
  type Trek,
} from "@/data/treks";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";

// A row of the `posts` table (see supabase/schema.sql)
export type PostRow = {
  id: string;
  slug: string;
  code: string;
  name: string;
  macro_region: string;
  area: string;
  difficulty: Difficulty;
  trek_date: string;
  author_id: string | null;
  author_name: string;
  excerpt: string;
  image_url: string;
  altitude: string;
  distance: string;
  duration: string;
  body: string[];
  tips: string[];
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

export function rowToTrek(row: PostRow): Trek {
  return {
    slug: row.slug,
    code: row.code,
    name: row.name,
    macroRegion: (MACRO_REGIONS as readonly string[]).includes(row.macro_region)
      ? (row.macro_region as MacroRegion)
      : MACRO_REGIONS[0],
    area: row.area,
    difficulty: row.difficulty,
    date: row.trek_date,
    author: row.author_name,
    excerpt: row.excerpt,
    image: row.image_url,
    stats: {
      altitude: row.altitude,
      distance: row.distance,
      duration: row.duration,
    },
    body: row.body,
    tips: row.tips,
  };
}

/** All published stories, newest trek first. */
export async function getPublishedTreks(): Promise<Trek[]> {
  if (!isSupabaseConfigured) return placeholderTreks;

  const { data, error } = await createPublicClient()
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("trek_date", { ascending: false });

  if (error) {
    console.error("Failed to load posts:", error.message);
    return [];
  }
  return (data as PostRow[]).map(rowToTrek);
}

export async function getPublishedTrek(slug: string): Promise<Trek | null> {
  if (!isSupabaseConfigured) {
    return placeholderTreks.find((t) => t.slug === slug) ?? null;
  }

  const { data } = await createPublicClient()
    .from("posts")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  return data ? rowToTrek(data as PostRow) : null;
}
