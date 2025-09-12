import Link from "next/link";

export default function JobBoardLogin({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  const next = searchParams?.next || "/job-board";
  const error = searchParams?.error === "1";

  return (
    <section className="py-12">
      <div className="mx-auto max-w-sm px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-semibold">Job Board Access</h1>
        <p className="mt-2 text-slate-600">
          Enter the password to view the job board.
        </p>

        <form
          method="POST"
          action="/job-board/auth"
          className="mt-6 space-y-3 text-left"
        >
          <input type="hidden" name="next" value={next} />
          <label className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
          {error && (
            <p className="text-sm text-red-600">
              Incorrect password. Please try again.
            </p>
          )}
          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-brand-blue-600 px-4 py-2 font-semibold text-white hover:bg-brand-blue-700"
          >
            Unlock
          </button>
        </form>

        <Link
          href="/"
          className="mt-4 inline-block text-sm text-slate-600 hover:underline underline-offset-2"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
