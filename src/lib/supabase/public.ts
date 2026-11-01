import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

/**
 * Anonymous, cookie-less client for the public site. It only ever sees
 * published posts (enforced by row-level security), and because it doesn't
 * touch cookies the public pages can still be statically generated.
 */
export function createPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
