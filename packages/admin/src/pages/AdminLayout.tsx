import Link from "next/link";
import { auth, signOut } from "../auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const login = (session?.user as { login?: string } | undefined)?.login;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "0 clamp(1rem, 4vw, 3rem)",
          height: 56,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link
          href="/admin"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.78rem",
            fontWeight: 700,
            color: "var(--fg)",
            textDecoration: "none",
          }}
        >
          Admin
        </Link>
        <Link
          href="/admin/notes"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            color: "var(--muted)",
            textDecoration: "none",
          }}
        >
          Notes
        </Link>
        <Link
          href="/admin/blog"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            color: "var(--muted)",
            textDecoration: "none",
          }}
        >
          Blog
        </Link>
        <Link
          href="/admin/photography"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            color: "var(--muted)",
            textDecoration: "none",
          }}
        >
          Photography
        </Link>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            color: "var(--muted)",
            textDecoration: "none",
          }}
        >
          View site ↗
        </Link>
        <span style={{ flex: 1 }} />
        {login && (
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: "var(--muted)",
            }}
          >
            @{login}
          </span>
        )}
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            style={{
              background: "transparent",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-sm)",
              padding: "0.35rem 0.7rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: "var(--fg)",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </form>
      </header>
      <main style={{ maxWidth: 820, margin: "0 auto", padding: "2.5rem clamp(1rem, 4vw, 2rem) 5rem" }}>
        {children}
      </main>
    </div>
  );
}
