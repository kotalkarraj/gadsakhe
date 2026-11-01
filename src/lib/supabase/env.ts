// Supabase connection settings, read from .env.local. When they're missing
// the public site falls back to the placeholder stories in data/treks.ts
// and the admin area shows setup instructions instead of crashing.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const IMAGE_BUCKET = "trek-images";
