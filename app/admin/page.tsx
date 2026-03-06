import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_superadmin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_superadmin) {
    redirect("/login");
  }

  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: imageCount } = await supabase
    .from("images")
    .select("*", { count: "exact", head: true });

  const { count: captionCount } = await supabase
    .from("captions")
    .select("*", { count: "exact", head: true });

  const { data: recentCaptions } = await supabase
    .from("captions")
    .select("id, content, like_count, created_datetime_utc")
    .order("created_datetime_utc", { ascending: false })
    .limit(5);

  const { data: recentImages } = await supabase
    .from("images")
    .select("id, url, image_description, created_datetime_utc")
    .order("created_datetime_utc", { ascending: false })
    .limit(3);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-pink-600">Admin Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
              Welcome, {user.email}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Manage your platform data and view insights.
            </p>
          </div>

          <nav className="flex flex-wrap gap-3">
            <Link
              href="/admin/users"
              className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Users
            </Link>
            <Link
              href="/admin/images"
              className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Images
            </Link>
            <Link
              href="/admin/captions"
              className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Captions
            </Link>
          </nav>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <p className="text-sm font-medium text-zinc-500">Total Users</p>
            <p className="mt-3 text-3xl font-bold text-zinc-900">
              {userCount ?? 0}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <p className="text-sm font-medium text-zinc-500">Total Images</p>
            <p className="mt-3 text-3xl font-bold text-zinc-900">
              {imageCount ?? 0}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <p className="text-sm font-medium text-zinc-500">Total Captions</p>
            <p className="mt-3 text-3xl font-bold text-zinc-900">
              {captionCount ?? 0}
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <h2 className="text-lg font-semibold text-zinc-900">
              Recent Captions
            </h2>

            <div className="mt-4 space-y-3">
              {recentCaptions && recentCaptions.length > 0 ? (
                recentCaptions.map((caption) => (
                  <div
                    key={caption.id}
                    className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-700"
                  >
                    <p className="font-medium text-zinc-900">
                      {caption.content}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
                      <span>Likes: {caption.like_count ?? 0}</span>
                      <span>
                        {new Date(caption.created_datetime_utc).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600">
                  No captions found.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <h2 className="text-lg font-semibold text-zinc-900">
              Recent Images
            </h2>

            <div className="mt-4 space-y-3">
              {recentImages && recentImages.length > 0 ? (
                recentImages.map((image) => (
                  <div
                    key={image.id}
                    className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-700"
                  >
                    <p className="truncate font-medium text-zinc-900">
                      {image.image_description || "No description"}
                    </p>
                    <p className="mt-1 truncate text-xs text-zinc-500">
                      {image.url}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {new Date(image.created_datetime_utc).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600">
                  No images found.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">Quick Actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/admin/images"
              className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Manage Images
            </Link>
            <Link
              href="/admin/users"
              className="rounded-2xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              View Users
            </Link>
            <Link
              href="/admin/captions"
              className="rounded-2xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Read Captions
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}