// Definitions and code examples share one handler, discriminated by a `kind`
// field in the body (POST upsert) or query string (DELETE ?kind=&key=).
export { GET, POST, DELETE } from "@mtosity/admin/api/blog-definitions";

export const dynamic = "force-dynamic";
