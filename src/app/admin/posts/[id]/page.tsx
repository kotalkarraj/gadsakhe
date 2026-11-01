import { notFound } from "next/navigation";
import { requireAuthor } from "@/lib/auth";
import type { PostRow } from "@/lib/posts";
import PostForm from "@/components/admin/PostForm";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditPostPage({ params, searchParams }: Props) {
  const [{ id }, { saved }, { supabase, userId, profile }] = await Promise.all([
    params,
    searchParams,
    requireAuthor(),
  ]);

  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  const post = data as PostRow | null;

  // Row-level security already hides other people's drafts; this also
  // stops authors opening someone else's published story for editing.
  if (!post || (profile.role !== "admin" && post.author_id !== userId)) {
    notFound();
  }

  return (
    <PostForm
      post={post}
      defaultAuthor={profile.display_name}
      saved={saved === "published" || saved === "draft" ? saved : undefined}
    />
  );
}
