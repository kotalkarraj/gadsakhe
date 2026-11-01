import { requireAuthor } from "@/lib/auth";
import PostForm from "@/components/admin/PostForm";

export default async function NewPostPage() {
  const { profile } = await requireAuthor();
  return <PostForm defaultAuthor={profile.display_name} />;
}
