import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function updateHumorMix(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const humor_flavor_id = String(formData.get("humor_flavor_id") ?? "");
  const caption_count = Number(formData.get("caption_count") ?? 0);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!id || !humor_flavor_id) return;

  await supabase
    .from("humor_flavor_mix")
    .update({
      humor_flavor_id,
      caption_count,
    })
    .eq("id", id);

  revalidatePath("/admin/humor");
}

async function createTerm(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const term = String(formData.get("term") ?? "").trim();
  const definition = String(formData.get("definition") ?? "").trim();
  const example = String(formData.get("example") ?? "").trim();
  const priorityValue = formData.get("priority");
  const term_type_id = String(formData.get("term_type_id") ?? "").trim();

  const priority =
    priorityValue === null || String(priorityValue).trim() === ""
      ? null
      : Number(priorityValue);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!term) return;

  await supabase.from("terms").insert({
    term,
    definition: definition || null,
    example: example || null,
    priority,
    term_type_id: term_type_id || null,
  });

  revalidatePath("/admin/humor");
}

async function updateTerm(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const term = String(formData.get("term") ?? "").trim();
  const definition = String(formData.get("definition") ?? "").trim();
  const example = String(formData.get("example") ?? "").trim();
  const priorityValue = formData.get("priority");
  const term_type_id = String(formData.get("term_type_id") ?? "").trim();

  const priority =
    priorityValue === null || String(priorityValue).trim() === ""
      ? null
      : Number(priorityValue);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!id || !term) return;

  await supabase
    .from("terms")
    .update({
      term,
      definition: definition || null,
      example: example || null,
      priority,
      term_type_id: term_type_id || null,
      modified_datetime_utc: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin/humor");
}

async function deleteTerm(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!id) return;

  await supabase.from("terms").delete().eq("id", id);

  revalidatePath("/admin/humor");
}

export default async function HumorPage() {
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

  const { data: humorFlavors } = await supabase
    .from("humor_flavors")
    .select("id, created_datetime_utc, description, slug")
    .order("created_datetime_utc", { ascending: false });

  const { data: humorFlavorSteps } = await supabase
    .from("humor_flavor_steps")
    .select(
      "id, created_datetime_utc, humor_flavor_id, llm_temperature, order_by, llm_input_type_id, llm_output_type_id, llm_model_id, humor_flavor_step_type_id, llm_system_prompt, llm_user_prompt, description"
    )
    .order("created_datetime_utc", { ascending: false });

  const { data: humorFlavorMix } = await supabase
    .from("humor_flavor_mix")
    .select("id, created_datetime_utc, humor_flavor_id, caption_count")
    .order("created_datetime_utc", { ascending: false });

  const { data: terms } = await supabase
    .from("terms")
    .select(
      "id, created_datetime_utc, modified_datetime_utc, term, definition, example, priority, term_type_id"
    )
    .order("created_datetime_utc", { ascending: false });

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 flex items-center justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <div>
            <p className="text-sm font-medium text-pink-600">Admin Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
              Humor
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Review humor flavors and steps, manage humor mix, and edit terms.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
          >
            Back to Dashboard
          </Link>
        </header>

        <section className="mb-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200">
          <div className="border-b border-zinc-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-zinc-900">Humor Flavors</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Read available humor flavor records.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Slug</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {humorFlavors && humorFlavors.length > 0 ? (
                  humorFlavors.map((flavor) => (
                    <tr key={flavor.id} className="border-t border-zinc-100">
                      <td className="px-6 py-4 text-zinc-900">{flavor.slug ?? "—"}</td>
                      <td className="px-6 py-4 text-zinc-600">
                        {flavor.description ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-zinc-600">
                        {flavor.created_datetime_utc
                          ? new Date(flavor.created_datetime_utc).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
                      No humor flavors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200">
          <div className="border-b border-zinc-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-zinc-900">Humor Flavor Steps</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Read flavor step configuration and prompts.
            </p>
          </div>

          <div className="space-y-4 p-6">
            {humorFlavorSteps && humorFlavorSteps.length > 0 ? (
              humorFlavorSteps.map((step) => (
                <div
                  key={step.id}
                  className="rounded-3xl border border-zinc-200 p-5"
                >
                  <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Flavor ID: {step.humor_flavor_id}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Order: {step.order_by ?? "—"}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Temp: {step.llm_temperature ?? "—"}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Model ID: {step.llm_model_id ?? "—"}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Step Type ID: {step.humor_flavor_step_type_id ?? "—"}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Input Type ID: {step.llm_input_type_id ?? "—"}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Output Type ID: {step.llm_output_type_id ?? "—"}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl bg-zinc-50 p-4">
                      <p className="text-sm font-semibold text-zinc-900">Description</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600">
                        {step.description ?? "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-zinc-50 p-4">
                      <p className="text-sm font-semibold text-zinc-900">System Prompt</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600">
                        {step.llm_system_prompt ?? "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-zinc-50 p-4">
                    <p className="text-sm font-semibold text-zinc-900">User Prompt</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600">
                      {step.llm_user_prompt ?? "—"}
                    </p>
                  </div>

                  <p className="mt-4 text-xs text-zinc-500">
                    Created:{" "}
                    {step.created_datetime_utc
                      ? new Date(step.created_datetime_utc).toLocaleString()
                      : "—"}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-zinc-500">
                No humor flavor steps found.
              </div>
            )}
          </div>
        </section>

        <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">Humor Flavor Mix</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Update how many captions each humor flavor should contribute.
          </p>

          <div className="mt-6 space-y-4">
            {humorFlavorMix && humorFlavorMix.length > 0 ? (
              humorFlavorMix.map((mix) => (
                <div
                  key={mix.id}
                  className="rounded-2xl border border-zinc-200 p-4"
                >
                  <form action={updateHumorMix} className="grid gap-4 md:grid-cols-2">
                    <input type="hidden" name="id" value={mix.id} />

                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-zinc-700">
                        Humor Flavor ID
                      </label>
                      <input
                        name="humor_flavor_id"
                        type="text"
                        defaultValue={mix.humor_flavor_id ?? ""}
                        className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-zinc-700">
                        Caption Count
                      </label>
                      <input
                        name="caption_count"
                        type="number"
                        defaultValue={mix.caption_count ?? 0}
                        className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
                      />
                    </div>

                    <div className="md:col-span-2 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>

                  <p className="mt-3 text-xs text-zinc-500">
                    Created:{" "}
                    {mix.created_datetime_utc
                      ? new Date(mix.created_datetime_utc).toLocaleString()
                      : "—"}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-500">
                No humor flavor mix rows found.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">Terms</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Create, edit, and delete glossary or configuration terms.
          </p>

          <form action={createTerm} className="mt-4 grid gap-4">
            <input
              name="term"
              type="text"
              placeholder="Term"
              required
              className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
            />

            <textarea
              name="definition"
              placeholder="Definition"
              className="min-h-[100px] rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
            />

            <textarea
              name="example"
              placeholder="Example"
              className="min-h-[100px] rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="priority"
                type="number"
                placeholder="Priority"
                className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
              />

              <input
                name="term_type_id"
                type="text"
                placeholder="Term Type ID"
                className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
              />
            </div>

            <button
              type="submit"
              className="w-fit rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Add Term
            </button>
          </form>

          <div className="mt-6 space-y-4">
            {terms && terms.length > 0 ? (
              terms.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-2xl border border-zinc-200 p-4"
                >
                  <form action={updateTerm} className="grid gap-4">
                    <input type="hidden" name="id" value={entry.id} />

                    <input
                      name="term"
                      type="text"
                      defaultValue={entry.term ?? ""}
                      className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
                    />

                    <textarea
                      name="definition"
                      defaultValue={entry.definition ?? ""}
                      className="min-h-[90px] rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
                    />

                    <textarea
                      name="example"
                      defaultValue={entry.example ?? ""}
                      className="min-h-[90px] rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        name="priority"
                        type="number"
                        defaultValue={entry.priority ?? ""}
                        className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
                      />

                      <input
                        name="term_type_id"
                        type="text"
                        defaultValue={entry.term_type_id ?? ""}
                        className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
                      >
                        Save
                      </button>
                    </div>
                  </form>

                  <form action={deleteTerm} className="mt-3">
                    <input type="hidden" name="id" value={entry.id} />
                    <button
                      type="submit"
                      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </form>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-500">
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Priority: {entry.priority ?? "—"}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Term Type ID: {entry.term_type_id ?? "—"}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Created:{" "}
                      {entry.created_datetime_utc
                        ? new Date(entry.created_datetime_utc).toLocaleString()
                        : "—"}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Modified:{" "}
                      {entry.modified_datetime_utc
                        ? new Date(entry.modified_datetime_utc).toLocaleString()
                        : "—"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-500">
                No terms found.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
