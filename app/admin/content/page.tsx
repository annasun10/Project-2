import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function createImage(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const url = String(formData.get("url") ?? "").trim();
  const image_description = String(formData.get("image_description") ?? "").trim();
  const is_public = formData.get("is_public") === "on";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!url) return;

  await supabase.from("images").insert({
    url,
    image_description,
    is_public,
    profile_id: user.id,
  });

  revalidatePath("/admin/content");
}

async function updateImage(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const url = String(formData.get("url") ?? "").trim();
  const image_description = String(formData.get("image_description") ?? "").trim();
  const is_public = formData.get("is_public") === "on";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!id || !url) return;

  await supabase
    .from("images")
    .update({
      url,
      image_description,
      is_public,
    })
    .eq("id", id);

  revalidatePath("/admin/content");
}

async function deleteImage(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!id) return;

  await supabase.from("images").delete().eq("id", id);

  revalidatePath("/admin/content");
}

async function createCaptionExample(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const caption = String(formData.get("caption") ?? "").trim();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!caption) return;

  await supabase.from("caption_examples").insert({
    caption,
  });

  revalidatePath("/admin/content");
}

async function updateCaptionExample(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const caption = String(formData.get("caption") ?? "").trim();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!id || !caption) return;

  await supabase
    .from("caption_examples")
    .update({ caption })
    .eq("id", id);

  revalidatePath("/admin/content");
}

async function deleteCaptionExample(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!id) return;

  await supabase.from("caption_examples").delete().eq("id", id);

  revalidatePath("/admin/content");
}

export default async function ContentPage() {
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

  const { data: captions } = await supabase
    .from("captions")
    .select("id, content, like_count, is_public, is_featured, created_datetime_utc, image_id, profile_id")
    .order("created_datetime_utc", { ascending: false });

  const { data: captionRequests } = await supabase
    .from("caption_requests")
    .select("*")
    .order("created_datetime_utc", { ascending: false });

  const { data: captionExamples } = await supabase
    .from("caption_examples")
    .select("*")
    .order("created_datetime_utc", { ascending: false });

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 flex items-center justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <div>
            <p className="text-sm font-medium text-pink-600">Admin Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
              Content
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Manage images, review captions, inspect caption requests, and edit caption examples.
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

        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-zinc-900">Images</h2>
            <p className="text-sm text-zinc-600">
              Create, edit, and delete image records.
            </p>
          </div>

          <div className="space-y-6">
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
          </div>
        </section>

        <section className="mb-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200">
          <div className="border-b border-zinc-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-zinc-900">Captions</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Read caption data and review engagement.
            </p>
          </div>

          <div className="space-y-4 p-6">
            {captions && captions.length > 0 ? (
              captions.map((caption) => (
                <div
                  key={caption.id}
                  className="rounded-3xl border border-zinc-200 p-6"
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
              <div className="rounded-3xl bg-zinc-50 p-8 text-center text-zinc-500">
                No captions found.
              </div>
            )}
          </div>
        </section>

        <section className="mb-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200">
          <div className="border-b border-zinc-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-zinc-900">Caption Requests</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Read incoming caption request records.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Image ID</th>
                  <th className="px-6 py-4 font-semibold">Profile ID</th>
                  <th className="px-6 py-4 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {captionRequests && captionRequests.length > 0 ? (
                  captionRequests.map((request) => (
                    <tr key={request.id} className="border-t border-zinc-100">
                      <td className="px-6 py-4 text-zinc-900">{request.id}</td>
                      <td className="px-6 py-4 text-zinc-600">
                        {request.image_id ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-zinc-600">
                        {request.profile_id ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-zinc-600">
                        {request.created_datetime_utc
                          ? new Date(request.created_datetime_utc).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                      No caption requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">Caption Examples</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Create, edit, and delete caption examples.
          </p>

          <form action={createCaptionExample} className="mt-4 grid gap-4">
            <textarea
              name="caption"
              placeholder="Write a caption example..."
              required
              className="min-h-[100px] rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
            />
            <button
              type="submit"
              className="w-fit rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Add Caption Example
            </button>
          </form>

          <div className="mt-6 space-y-4">
            {captionExamples && captionExamples.length > 0 ? (
              captionExamples.map((example) => (
                <div
                  key={example.id}
                  className="rounded-2xl border border-zinc-200 p-4"
                >
                  <form action={updateCaptionExample} className="grid gap-3">
                    <input type="hidden" name="id" value={example.id} />
                    <textarea
                      name="caption"
                      defaultValue={example.caption ?? ""}
                      className="min-h-[100px] rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
                    />
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
                      >
                        Save
                      </button>
                    </div>
                  </form>

                  <form action={deleteCaptionExample} className="mt-3">
                    <input type="hidden" name="id" value={example.id} />
                    <button
                      type="submit"
                      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </form>

                  <p className="mt-3 text-xs text-zinc-500">
                    Created:{" "}
                    {example.created_datetime_utc
                      ? new Date(example.created_datetime_utc).toLocaleString()
                      : "—"}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-500">
                No caption examples found.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}