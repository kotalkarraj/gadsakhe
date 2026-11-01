import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  display_name: string;
  role: "author" | "admin";
};

/**
 * The signed-in author and their profile, or redirect to the login page.
 * Use at the top of every admin page and server action.
 */
export async function requireAuthor() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, role")
    .eq("id", userId)
    .single<Profile>();

  return {
    supabase,
    userId,
    email: (data.claims.email as string | undefined) ?? "",
    profile: profile ?? { id: userId, display_name: "", role: "author" as const },
  };
}
