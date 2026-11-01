import type { Metadata } from "next";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import SetupNotice from "@/components/admin/SetupNotice";

export const metadata: Metadata = {
  title: "Admin — Gadsakhe",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col">
      {/* Dark band so the floating site header stays readable */}
      <div className="h-24 bg-dusk" />
      <div className="mx-auto w-full max-w-5xl flex-1 px-6 sm:px-10 py-12">
        {isSupabaseConfigured ? children : <SetupNotice />}
      </div>
    </main>
  );
}
