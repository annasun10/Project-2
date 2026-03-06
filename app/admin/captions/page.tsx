import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function CaptionsPage() {
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

  const { data: captions } = await supabase
    .from("captions")
    .select("id, content, like_count, is_public, is_featured, created_datetime_utc, image_id, profile_id")
    .order("created_datetime_utc", { ascending: false });

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 flex items-center justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <div>
            <p className="text-sm font-medium text-pink-600">Admin Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
              Captions
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Read caption data and review engagement.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
          >
            Back to Dashboard
          </Link>
        </header>

        <div className="space-y-4">
          {captions && captions.length > 0 ? (
            captions.map((caption) => (
              <div
                key={caption.id}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200"
              >
                <p className="text-base font-medium text-zinc-900">
                  {caption.content}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-zinc-500">
                  <span className="rounded-full bg-zinc-100 px-3 py-1">
                    Likes: {caption.like_count ?? 0}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1">
                    Public: {caption.is_public ? "Yes" : "No"}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1">
                    Featured: {caption.is_featured ? "Yes" : "No"}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1">
                    Image ID: {caption.image_id}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1">
                    Profile ID: {caption.profile_id}
                  </span>
                </div>

                <p className="mt-4 text-sm text-zinc-500">
                  {caption.created_datetime_utc
                    ? new Date(caption.created_datetime_utc).toLocaleString()
                    : "—"}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-3xl bg-white p-8 text-center text-zinc-500 shadow-sm ring-1 ring-zinc-200">
              No captions found.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}