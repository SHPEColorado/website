import { headers } from "next/headers";

export default async function InstagramGrid({ limit = 6 }: { limit?: number }) {
  const h = headers();
  const proto = (await h).get("x-forwarded-proto") ?? "http";
  const host  = (await h).get("x-forwarded-host") ?? (await h).get("host");
  const base  = `${proto}://${host}`;

  const res = await fetch(`${base}/api/instagram/feed`, { next: { revalidate: 900 } });
  if (!res.ok) return null;

  const { items = [] } = await res.json();
  const posts = items.slice(0, limit);

  if (!posts.length) return null;

  return (
    <section className="py-10 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">From Instagram</h2>
          <a href="https://www.instagram.com/SHPEColorado" target="_blank" rel="noopener noreferrer"
             className="text-sm font-medium text-brand-blue-600">
            Follow us
          </a>
        </div>
        <div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          {posts.map((p: any) => (
            <a key={p.id} href={p.permalink} target="_blank" rel="noopener noreferrer" className="block group">
              <img
                src={p.media_url}
                alt={p.caption || "Instagram post"}
                className="aspect-square object-cover rounded-lg border border-slate-200 group-hover:opacity-90"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
