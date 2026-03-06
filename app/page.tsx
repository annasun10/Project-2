import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50 text-zinc-900">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex rounded-full border border-pink-200 bg-white/80 px-4 py-1 text-sm font-medium text-pink-700 shadow-sm">
            Private Admin Dashboard
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Manage users, images, captions, and app insights
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            A protected admin area for viewing platform statistics, reviewing
            profiles, managing images, and reading captions.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-zinc-800"
            >
              Sign in
            </Link>

            <Link
              href="/admin"
              className="rounded-2xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-50"
            >
              Open admin
            </Link>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-zinc-200 bg-white/80 p-5 shadow-sm">
              <p className="text-sm font-medium text-zinc-500">Users</p>
              <p className="mt-2 text-2xl font-bold">Profiles</p>
              <p className="mt-2 text-sm text-zinc-600">
                Read and review user accounts.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/80 p-5 shadow-sm">
              <p className="text-sm font-medium text-zinc-500">Images</p>
              <p className="mt-2 text-2xl font-bold">CRUD</p>
              <p className="mt-2 text-sm text-zinc-600">
                Create, update, and delete image records.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/80 p-5 shadow-sm">
              <p className="text-sm font-medium text-zinc-500">Captions</p>
              <p className="mt-2 text-2xl font-bold">Insights</p>
              <p className="mt-2 text-sm text-zinc-600">
                View captions and platform activity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}