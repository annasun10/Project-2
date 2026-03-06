import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function createImage(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const url = formData.get("url") as string;
  const image_description = formData.get("image_description") as string;
  const is_public = formData.get("is_public") === "on";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase.from("images").insert({
    url,
    image_description,
    is_public,
    profile_id: user.id,
  });

  revalidatePath("/admin/images");
}

async function updateImage(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = formData.get("id") as string;
  const url = formData.get("url") as string;
  const image_description = formData.get("image_description") as string;
  const is_public = formData.get("is_public") === "on";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("images")
    .update({
      url,
      image_description,
      is_public,
    })
    .eq("id", id);

  revalidatePath("/admin/images");
}

async function deleteImage(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = formData.get("id") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase.from("images").delete().eq("id", id);

  revalidatePath("/admin/images");
}

export default async function ImagesPage() {
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

  const { data: images } = await supabase
    .from("images")
    .select("id, url, image_description, is_public, created_datetime_utc")
    .order("created_datetime_utc", { ascending: false });

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 flex items-center justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <div>
            <p className="text-sm font-medium text-pink-600">Admin Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
              Images
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Create, edit, and delete image records.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
          >
            Back to Dashboard
          </Link>
        </header>

        <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">Add New Image</h2>

          <form action={createImage} className="mt-4 grid gap-4">
            <input
              name="url"
              type="text"
              placeholder="Image URL"
              required
              className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
            />

            <textarea
              name="image_description"
              placeholder="Image description"
              className="min-h-[100px] rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
            />

            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input type="checkbox" name="is_public" />
              Public image
            </label>

            <button
              type="submit"
              className="w-fit rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Create Image
            </button>
          </form>
        </section>

        <section className="space-y-6">
          {images && images.length > 0 ? (
            images.map((image) => (
              <div
                key={image.id}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200"
              >
                <div className="mb-5 overflow-hidden rounded-2xl bg-zinc-100">
                  <img
                    src={image.url}
                    alt={image.image_description || "Image preview"}
                    className="h-auto max-h-[420px] w-full object-contain"
                  />
                </div>

                <form action={updateImage} className="grid gap-4">
                  <input type="hidden" name="id" value={image.id} />

                  <input
                    name="url"
                    type="text"
                    defaultValue={image.url}
                    className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
                  />

                  <textarea
                    name="image_description"
                    defaultValue={image.image_description ?? ""}
                    className="min-h-[90px] rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
                  />

                  <label className="flex items-center gap-2 text-sm text-zinc-700">
                    <input
                      type="checkbox"
                      name="is_public"
                      defaultChecked={image.is_public ?? false}
                    />
                    Public image
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>

                <form action={deleteImage} className="mt-3">
                  <input type="hidden" name="id" value={image.id} />
                  <button
                    type="submit"
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                  >
                    Delete Image
                  </button>
                </form>

                <p className="mt-4 text-xs text-zinc-500">
                  Created:{" "}
                  {image.created_datetime_utc
                    ? new Date(image.created_datetime_utc).toLocaleString()
                    : "—"}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-3xl bg-white p-8 text-center text-zinc-500 shadow-sm ring-1 ring-zinc-200">
              No images found.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}