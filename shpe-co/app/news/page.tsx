export const dynamic = "force-dynamic";
export const revalidate = 300;

type NewsletterItem = {
  id: string;
  title: string;
  url: string;
  sentAt?: string;
};

function fmt(date?: string) {
  try {
    return date
      ? new Intl.DateTimeFormat(undefined, {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }).format(new Date(date))
      : "";
  } catch {
    return date ?? "";
  }
}

export default async function NewsPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const res = await fetch(`${base}/api/newsletters/rss`, {
    next: { revalidate: 300 },
  });

  const data: { items: NewsletterItem[] } = res.ok
    ? await res.json()
    : { items: [] };
  const items = data.items;
  const latest = items[0];
  const gridItems = items.slice(1, 10); // last 9 below the latest

  return (
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header + Subscribe */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Newsletters
          </h1>
          <p className="text-slate-600">
            Recent newsletters. Subscribe to get the latest in your inbox.
          </p>
          <div className="flex justify-center">
            <a
              href="https://shpecolorado.us19.list-manage.com/subscribe?u=bd8bf44c5b9d6024fcfe99cd4&id=850184cc59"
              target="_blank"
              rel="noopener noreferrer"
              className={
                "inline-flex items-center rounded-lg ring-1 ring-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              }
              aria-label="Subscribe to SHPE Colorado newsletter on Mailchimp"
            >
              Join our mailing list
            </a>
          </div>
        </div>

        {/* Featured: latest */}
        {latest && (
          <section className="mt-4 mb-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-8 shadow-sm">
              <p className="text-sm font-medium text-brand-blue-600">
                Latest newsletter
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{latest.title}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {fmt(latest.sentAt)}
              </p>

              <div className="flex justify-end">
                <a
                  href={latest.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg ring-1 ring-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Read on Mailchimp
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Grid: last 9 */}
        <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gridItems.map((n) => (
            <article
              key={n.id}
              className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col"
            >
              <h3 className="font-semibold">{n.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{fmt(n.sentAt)}</p>

              <div className="mt-auto pt-4 flex justify-end">
                <a
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg ring-1 ring-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Read on Mailchimp
                </a>
              </div>
            </article>
          ))}
        </div>

        {!items.length && (
          <p className="mt-2 text-slate-500 text-center">
            No newsletters yet. (Mailchimp archives show the most recent ~20
            campaigns and may take a bit to update.)
          </p>
        )}
      </div>
    </section>
  );
}
