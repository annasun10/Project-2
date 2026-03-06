import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-zinc-50 to-zinc-100 text-zinc-900">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-20">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex rounded-full border border-zinc-200 bg-white px-4 py-1 text-sm text-zinc-600 shadow-sm">
            Private admin dashboard
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Manage your app’s data in one place
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
            View stats, review users, manage images, and inspect captions
            through a protected admin area.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/login"
              className="rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Sign in
            </Link>

            <Link
              href="/admin"
              className="rounded-2xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
            >
              Open admin
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}