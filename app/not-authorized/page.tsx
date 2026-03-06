import Link from "next/link";

export default function NotAuthorizedPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm text-center">
        <p className="text-sm font-medium text-pink-600">Access Denied</p>
        <h1 className="mt-2 text-3xl font-bold text-zinc-900">
          You are not authorized
        </h1>
        <p className="mt-3 text-sm text-zinc-600">
          Your account does not have permission to view this admin area.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/login"
            className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Back to Login
          </Link>

          <Link
            href="/"
            className="rounded-2xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}