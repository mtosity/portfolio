export { default as AdminLayout } from "./pages/AdminLayout";
export { default as AdminDashboard } from "./pages/AdminDashboard";
export { default as AdminNotes } from "./pages/AdminNotes";
export { default as NewNotePage } from "./pages/NewNotePage";
export { default as EditNotePage } from "./pages/EditNotePage";
export { default as AdminPhotography } from "./pages/AdminPhotography";
export { default as AdminBlog } from "./pages/AdminBlog";
export { default as NewBlogPostPage } from "./pages/NewBlogPostPage";
export { default as EditBlogPostPage } from "./pages/EditBlogPostPage";
export { default as AdminBlogDefinitions } from "./pages/AdminBlogDefinitions";

// Shared blog types + the anchor-key rule. Free of Tiptap and of "use client",
// so server code (API handlers, renderer) can import them safely.
export {
  BLOG_CATEGORIES,
  ANCHOR_KEY_PATTERN,
  isBlogCategory,
  type BlogCategory,
  type BlogPostRecord,
  type BlogPostSummary,
  type BlogPostInput,
  type BlogDefinition,
  type BlogCodeExample,
  type CodeSnippet,
} from "./components/blog/blogTypes";
