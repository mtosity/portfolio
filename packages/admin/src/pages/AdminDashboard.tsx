import Link from "next/link";
import Image from "next/image";
import { list } from "@vercel/blob";
import { listAllNotes } from "@mtosity/lib/notes";


const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp"];

function formatDate(iso: string | number) {
  return new Date(iso)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
}

async function getRecentNotes() {
  try {
    return (await listAllNotes()).slice(0, 5);
  } catch {
    return null; // signal error
  }
}

async function getRecentPhotos() {
  try {
    const { blobs } = await list({ prefix: "gallery/", limit: 1000 });
    return blobs
      .filter((b) => IMAGE_EXTS.some((e) => b.pathname.toLowerCase().endsWith(e)))
      .map((b) => ({ url: b.url, uploadedAt: new Date(b.uploadedAt).getTime() }))
      .sort((a, b) => b.uploadedAt - a.uploadedAt);
  } catch {
    return null;
  }
}

export default async function Dashboard() {
  const [recentNotes, allPhotos] = await Promise.all([
    getRecentNotes(),
    getRecentPhotos(),
  ]);
  const recentPhotos = allPhotos?.slice(0, 8) ?? [];

  return (
    <div className="dash">
      <h1 className="dash-h1">Dashboard</h1>

      {/* Quick actions */}
      <div className="dash-actions">
        <Link href="/admin/notes/new" className="dash-action">
          <span className="dash-action-plus">+</span>
          <span>
            <span className="dash-action-title">New note</span>
            <span className="dash-action-sub">Write &amp; publish</span>
          </span>
        </Link>
        <Link href="/admin/photography" className="dash-action">
          <span className="dash-action-plus">+</span>
          <span>
            <span className="dash-action-title">Add photo</span>
            <span className="dash-action-sub">Upload to gallery</span>
          </span>
        </Link>
      </div>

      <div className="dash-cols">
        {/* Recent notes */}
        <section>
          <div className="dash-sec-head">
            <h2 className="dash-h2">Recent notes</h2>
            <Link href="/admin/notes" className="dash-viewall">
              View all →
            </Link>
          </div>
          {recentNotes === null ? (
            <p className="dash-error">
              Could not reach the database (check Postgres env vars).
            </p>
          ) : recentNotes.length === 0 ? (
            <p className="dash-empty">No notes yet.</p>
          ) : (
            <ul className="dash-list">
              {recentNotes.map((n) => (
                <li key={n.id} className="dash-row">
                  <span className="dash-row-date">{formatDate(n.createdAt)}</span>
                  <Link href={`/admin/notes/${n.id}/edit`} className="dash-row-title">
                    {n.title}
                  </Link>
                  {!n.published && <span className="dash-draft">Draft</span>}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent photos */}
        <section>
          <div className="dash-sec-head">
            <h2 className="dash-h2">Recent photos</h2>
            <Link href="/admin/photography" className="dash-viewall">
              View all →
            </Link>
          </div>
          {allPhotos === null ? (
            <p className="dash-error">Could not reach Blob storage.</p>
          ) : recentPhotos.length === 0 ? (
            <p className="dash-empty">No photos yet.</p>
          ) : (
            <div className="dash-photos">
              {recentPhotos.map((p) => (
                <Link key={p.url} href="/admin/photography" className="dash-photo">
                  <Image
                    src={p.url}
                    alt=""
                    fill
                    sizes="120px"
                    quality={45}
                    style={{ objectFit: "cover" }}
                  />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <style>{`
        .dash-h1 {
          font-family: var(--font-crimson-text), Georgia, serif;
          font-size: 2.1rem; font-weight: 600; margin: 0 0 1.5rem;
        }
        .dash-actions {
          display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; margin-bottom: 2.5rem;
        }
        .dash-action {
          display: flex; align-items: center; gap: 0.9rem;
          padding: 1.1rem 1.25rem;
          border: 1px solid var(--border);
          border-radius: 4px;
          background: var(--bg-secondary);
          text-decoration: none; color: var(--fg);
          transition: background 0.15s, transform 0.1s;
        }
        .dash-action:hover {
          background: var(--accent);
          /* Ink-on-lime so text/borders pop in both themes; --bg keeps the
             plus chip a cream square on the lime surface. */
          --fg: var(--accent-fg);
          --muted: var(--accent-fg-muted);
          --border: var(--accent-fg);
          --bg: #f2efe8;
        }
        .dash-action:active { transform: translateY(1px); }
        .dash-action-plus {
          font-size: 1.6rem; line-height: 1; font-weight: 300;
          width: 38px; height: 38px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--border); border-radius: 3px; background: var(--bg);
        }
        .dash-action-title {
          display: block; font-family: var(--font-mono); font-size: 0.82rem; font-weight: 700;
        }
        .dash-action-sub {
          display: block; font-family: var(--font-mono); font-size: 0.66rem; color: var(--muted); margin-top: 2px;
        }
        .dash-cols {
          display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem;
        }
        @media (max-width: 700px) {
          .dash-cols { grid-template-columns: 1fr; gap: 2rem; }
          .dash-actions { grid-template-columns: 1fr; }
        }
        .dash-sec-head {
          display: flex; align-items: baseline; justify-content: space-between;
          margin-bottom: 0.75rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;
        }
        .dash-h2 {
          font-family: var(--font-mono); font-size: 0.74rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.15em; margin: 0; color: var(--fg);
        }
        .dash-viewall {
          font-family: var(--font-mono); font-size: 0.68rem; color: var(--muted); text-decoration: none;
        }
        .dash-viewall:hover { color: var(--fg); }
        .dash-list { list-style: none; margin: 0; padding: 0; }
        .dash-row {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0;
          border-bottom: 1px solid var(--border-light);
        }
        .dash-row-date {
          font-family: var(--font-mono); font-size: 0.58rem; letter-spacing: 0.08em;
          color: var(--muted); width: 86px; flex-shrink: 0;
        }
        .dash-row-title {
          font-family: var(--font-crimson-text), Georgia, serif; font-size: 0.98rem;
          color: var(--fg); text-decoration: none; flex: 1;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .dash-row-title:hover { color: var(--muted); }
        .dash-draft {
          font-family: var(--font-mono); font-size: 0.54rem; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--muted);
          border: 1px solid var(--border-light); border-radius: 2px; padding: 0.1rem 0.35rem;
        }
        .dash-photos {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;
        }
        .dash-photo {
          position: relative; aspect-ratio: 1 / 1; border-radius: 3px; overflow: hidden;
          border: 1px solid var(--border-light); background: var(--bg-secondary);
          display: block;
        }
        .dash-photo:hover { opacity: 0.85; }
        .dash-empty, .dash-error {
          font-family: var(--font-mono); font-size: 0.74rem; color: var(--muted); margin: 0.5rem 0;
        }
        .dash-error { color: #b00020; }
      `}</style>
    </div>
  );
}
