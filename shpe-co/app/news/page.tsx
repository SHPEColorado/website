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

  // RSS list for grid
  const listRes = await fetch(`${base}/api/newsletters/rss`, {
    next: { revalidate: 300 },
  });
  const data: { items: NewsletterItem[] } = listRes.ok
    ? await listRes.json()
    : { items: [] };
  const items = data.items;
  const latest = items[0];
  const gridItems = items.slice(1, 10);

  // Latest full HTML
  const latestRes = await fetch(`${base}/api/newsletters/latest`, {
    next: { revalidate: 300 },
  });
  const latestData: {
    id: string;
    title: string;
    sentAt?: string | null;
    archiveUrl?: string | null;
    html?: string;
  } | null = latestRes.ok ? await latestRes.json() : null;

  const btnOutline =
    "inline-flex items-center rounded-lg ring-1 ring-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-slate-50";

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
              className={btnOutline}
              aria-label="Subscribe to SHPE Colorado newsletter on Mailchimp"
            >
              Join our mailing list
            </a>
          </div>
        </div>

        {/* Featured – mobile fallback (card) */}
        {latestData?.html ? (
          <>
            {/* MOBILE: show simple card with link instead of the heavy embed */}
            <section className="mt-6 sm:hidden">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-brand-blue-600">
                      Latest newsletter
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">
                      {latestData.title}
                    </h2>
                    {latestData.sentAt && (
                      <p className="mt-1 text-sm text-slate-600">
                        {fmt(latestData.sentAt)}
                      </p>
                    )}
                  </div>
                  {latestData.archiveUrl && (
                    <a
                      href={latestData.archiveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={btnOutline}
                    >
                      Read on Mailchimp
                    </a>
                  )}
                </div>
              </div>
            </section>

            {/* DESKTOP/TABLET: centered embedded HTML */}
            <section className="mt-6 hidden sm:block">
              <div className="mx-auto w-full max-w-[720px] rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                {/* Header strip with right-aligned action */}
                <div className="px-4 sm:px-6 pt-4 pb-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-brand-blue-600">
                        Latest newsletter
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold">
                        {latestData.title}
                      </h2>
                      {latestData.sentAt ? (
                        <p className="mt-1 text-sm text-slate-600">
                          {fmt(latestData.sentAt)}
                        </p>
                      ) : null}
                    </div>

                    {latestData.archiveUrl && (
                      <a
                        href={latestData.archiveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${btnOutline} self-start sm:self-auto`}
                      >
                        Open in new tab
                      </a>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-200" />

                {/* Scrollable body with hint */}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent" />

                  <div
                    className="max-h-[75vh] overflow-y-auto px-3 py-3
                               [scrollbar-width:thin] [scrollbar-color:theme(colors.slate.300)_transparent]"
                  >
                    <div
                      className="newsletter-html leading-relaxed space-y-3 text-[15px] sm:text-base
                                 [&_*]:max-w-full
                                 [&_img]:h-auto [&_img]:max-w-full [&_img]:mx-auto
                                 [&_a]:underline [&_a]:text-brand-blue-600
                                 [&_ul]:list-disc [&_ol]:list-decimal
                                 [&_ul]:pl-5 [&_ol]:pl-5
                                 [&_table]:mx-auto [&_table]:w-full [&_table]:table-fixed
                                 [&_td]:align-top [&_th]:align-top
                                 [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg"
                      dangerouslySetInnerHTML={{ __html: latestData.html }}
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : latest ? (
          // Fallback card if API content missing
          <section className="mt-6">
            <div className="mx-auto w-full max-w-[720px] rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-blue-600">
                    Latest newsletter
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold">
                    {latest.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {fmt(latest.sentAt)}
                  </p>
                </div>
                <a
                  href={latest.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={btnOutline}
                >
                  Read on Mailchimp
                </a>
              </div>
            </div>
          </section>
        ) : null}

        {/* Grid: last 9 */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  className={btnOutline}
                >
                  Read on Mailchimp
                </a>
              </div>
            </article>
          ))}
        </div>

        {!items.length && (
          <p className="mt-6 text-slate-500 text-center">
            No newsletters yet. (Mailchimp archives show the most recent ~20
            campaigns and may take a bit to update.)
          </p>
        )}
      </div>
    </section>
  );
}
