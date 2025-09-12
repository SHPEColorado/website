export const revalidate = 300;

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
  const { items = [] } = res.ok ? await res.json() : { items: [] };

  const latest = items[0]; // Mailchimp RSS is newest-first

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Newsletters
          </h1>
          <p className="mt-2 text-slate-600">Recent Mailchimp campaigns.</p>
        </div>

        {/* Featured: latest */}
        {latest && (
          <section className="mt-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <p className="text-sm font-medium text-brand-blue-600">
                Latest newsletter
              </p>
              <h2 className="mt-1 text-2xl font-semibold">{latest.title}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {fmt(latest.sentAt)}
              </p>

              {/* Same “ghost” button style as Upcoming Events */}
              <div className="mt-4 flex justify-end">
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

        {/* Grid of recent items */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((n) => (
            <article
              key={n.id}
              className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col"
            >
              <h3 className="font-semibold">{n.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{fmt(n.sentAt)}</p>

              {/* Button pinned bottom-right, matching Upcoming Events style */}
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
          <p className="mt-6 text-slate-500">
            No newsletters yet. (Mailchimp archives show the most recent ~20
            campaigns and may take a bit to update.)
          </p>
        )}
      </div>
    </section>
  );
}
