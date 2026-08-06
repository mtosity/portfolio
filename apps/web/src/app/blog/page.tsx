import BlogIndex from "@/components/blog/BlogIndex";
import { listBlogIndexItems } from "@/components/blog/postSource";

// ISR: the hand-written posts are build-time constants, but the database feed
// has to be able to appear without a redeploy after the admin hits Publish.
export const revalidate = 300;

export default async function BlogHome() {
  const posts = await listBlogIndexItems();
  return <BlogIndex posts={posts} />;
}
