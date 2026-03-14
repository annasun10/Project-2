import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function createLlmProvider(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!name) return;

  await supabase.from("llm_providers").insert({ name });

  revalidatePath("/admin/llm");
}

async function updateLlmProvider(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!id || !name) return;

  await supabase.from("llm_providers").update({ name }).eq("id", id);

  revalidatePath("/admin/llm");
}

async function deleteLlmProvider(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!id) return;

  await supabase.from("llm_providers").delete().eq("id", id);

  revalidatePath("/admin/llm");
}

async function createLlmModel(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const llm_provider_id = String(formData.get("llm_provider_id") ?? "").trim();
  const provider_model_id = String(formData.get("provider_model_id") ?? "").trim();
  const is_temperature_supported = formData.get("is_temperature_supported") === "on";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!name || !llm_provider_id || !provider_model_id) return;

  await supabase.from("llm_models").insert({
    name,
    llm_provider_id,
    provider_model_id,
    is_temperature_supported,
  });

  revalidatePath("/admin/llm");
}

async function updateLlmModel(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const llm_provider_id = String(formData.get("llm_provider_id") ?? "").trim();
  const provider_model_id = String(formData.get("provider_model_id") ?? "").trim();
  const is_temperature_supported = formData.get("is_temperature_supported") === "on";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!id || !name || !llm_provider_id || !provider_model_id) return;

  await supabase
    .from("llm_models")
    .update({
      name,
      llm_provider_id,
      provider_model_id,
      is_temperature_supported,
    })
    .eq("id", id);

  revalidatePath("/admin/llm");
}

async function deleteLlmModel(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!id) return;

  await supabase.from("llm_models").delete().eq("id", id);

  revalidatePath("/admin/llm");
}

export default async function LlmPage() {
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

  const { data: llmProviders } = await supabase
    .from("llm_providers")
    .select("id, created_datetime_utc, name")
    .order("created_datetime_utc", { ascending: false });

  const { data: llmModels } = await supabase
    .from("llm_models")
    .select(
      "id, created_datetime_utc, name, llm_provider_id, provider_model_id, is_temperature_supported"
    )
    .order("created_datetime_utc", { ascending: false });

  const { data: llmPromptChains } = await supabase
    .from("llm_prompt_chains")
    .select("id, created_datetime_utc, caption_request_id")
    .order("created_datetime_utc", { ascending: false });

  const { data: llmModelResponses } = await supabase
    .from("llm_model_responses")
    .select(
      "id, created_datetime_utc, llm_model_response, processing_time_seconds, llm_model_id, profile_id, caption_request_id, llm_system_prompt, llm_user_prompt, llm_temperature, humor_flavor_id, llm_prompt_chain_id, humor_flavor_step_id"
    )
    .order("created_datetime_utc", { ascending: false });

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 flex items-center justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <div>
            <p className="text-sm font-medium text-pink-600">Admin Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
              LLM
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Manage providers and models, and review prompt chains and model responses.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
          >
            Back to Dashboard
          </Link>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <h2 className="text-lg font-semibold text-zinc-900">LLM Providers</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Create, edit, and delete LLM providers.
            </p>

            <form action={createLlmProvider} className="mt-4 flex gap-3">
              <input
                name="name"
                type="text"
                placeholder="Provider name"
                required
                className="flex-1 rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
              />
              <button
                type="submit"
                className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Add
              </button>
            </form>

            <div className="mt-6 space-y-4">
              {llmProviders && llmProviders.length > 0 ? (
                llmProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className="rounded-2xl border border-zinc-200 p-4"
                  >
                    <form action={updateLlmProvider} className="grid gap-3">
                      <input type="hidden" name="id" value={provider.id} />
                      <input
                        name="name"
                        type="text"
                        defaultValue={provider.name ?? ""}
                        className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
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

                    <form action={deleteLlmProvider} className="mt-3">
                      <input type="hidden" name="id" value={provider.id} />
                      <button
                        type="submit"
                        className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </form>

                    <p className="mt-3 text-xs text-zinc-500">
                      Created:{" "}
                      {provider.created_datetime_utc
                        ? new Date(provider.created_datetime_utc).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-500">
                  No LLM providers found.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <h2 className="text-lg font-semibold text-zinc-900">LLM Models</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Create, edit, and delete LLM models.
            </p>

            <form action={createLlmModel} className="mt-4 grid gap-4">
              <input
                name="name"
                type="text"
                placeholder="Model name"
                required
                className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
              />
              <input
                name="llm_provider_id"
                type="text"
                placeholder="LLM Provider ID"
                required
                className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
              />
              <input
                name="provider_model_id"
                type="text"
                placeholder="Provider Model ID"
                required
                className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
              />
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input type="checkbox" name="is_temperature_supported" />
                Temperature supported
              </label>

              <button
                type="submit"
                className="w-fit rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Add LLM Model
              </button>
            </form>

            <div className="mt-6 space-y-4">
              {llmModels && llmModels.length > 0 ? (
                llmModels.map((model) => (
                  <div
                    key={model.id}
                    className="rounded-2xl border border-zinc-200 p-4"
                  >
                    <form action={updateLlmModel} className="grid gap-4">
                      <input type="hidden" name="id" value={model.id} />

                      <input
                        name="name"
                        type="text"
                        defaultValue={model.name ?? ""}
                        className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
                      />

                      <input
                        name="llm_provider_id"
                        type="text"
                        defaultValue={model.llm_provider_id ?? ""}
                        className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
                      />

                      <input
                        name="provider_model_id"
                        type="text"
                        defaultValue={model.provider_model_id ?? ""}
                        className="rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-pink-400"
                      />

                      <label className="flex items-center gap-2 text-sm text-zinc-700">
                        <input
                          type="checkbox"
                          name="is_temperature_supported"
                          defaultChecked={model.is_temperature_supported ?? false}
                        />
                        Temperature supported
                      </label>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="submit"
                          className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
                        >
                          Save
                        </button>
                      </div>
                    </form>

                    <form action={deleteLlmModel} className="mt-3">
                      <input type="hidden" name="id" value={model.id} />
                      <button
                        type="submit"
                        className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </form>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-500">
                      <span className="rounded-full bg-zinc-100 px-3 py-1">
                        Provider ID: {model.llm_provider_id ?? "—"}
                      </span>
                      <span className="rounded-full bg-zinc-100 px-3 py-1">
                        Provider Model ID: {model.provider_model_id ?? "—"}
                      </span>
                      <span className="rounded-full bg-zinc-100 px-3 py-1">
                        Created:{" "}
                        {model.created_datetime_utc
                          ? new Date(model.created_datetime_utc).toLocaleString()
                          : "—"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-500">
                  No LLM models found.
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="mt-8 mb-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200">
          <div className="border-b border-zinc-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-zinc-900">LLM Prompt Chains</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Read prompt chain records.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Caption Request ID</th>
                  <th className="px-6 py-4 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {llmPromptChains && llmPromptChains.length > 0 ? (
                  llmPromptChains.map((chain) => (
                    <tr key={chain.id} className="border-t border-zinc-100">
                      <td className="px-6 py-4 text-zinc-900">{chain.id}</td>
                      <td className="px-6 py-4 text-zinc-600">
                        {chain.caption_request_id ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-zinc-600">
                        {chain.created_datetime_utc
                          ? new Date(chain.created_datetime_utc).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
                      No LLM prompt chains found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200">
          <div className="border-b border-zinc-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-zinc-900">LLM Model Responses</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Read model responses, prompts, and timing data.
            </p>
          </div>

          <div className="space-y-4 p-6">
            {llmModelResponses && llmModelResponses.length > 0 ? (
              llmModelResponses.map((response) => (
                <div
                  key={response.id}
                  className="rounded-3xl border border-zinc-200 p-5"
                >
                  <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Model ID: {response.llm_model_id ?? "—"}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Profile ID: {response.profile_id ?? "—"}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Caption Request ID: {response.caption_request_id ?? "—"}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Humor Flavor ID: {response.humor_flavor_id ?? "—"}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Prompt Chain ID: {response.llm_prompt_chain_id ?? "—"}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Flavor Step ID: {response.humor_flavor_step_id ?? "—"}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Temp: {response.llm_temperature ?? "—"}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1">
                      Seconds: {response.processing_time_seconds ?? "—"}
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl bg-zinc-50 p-4">
                    <p className="text-sm font-semibold text-zinc-900">Response</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600">
                      {response.llm_model_response ?? "—"}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl bg-zinc-50 p-4">
                      <p className="text-sm font-semibold text-zinc-900">System Prompt</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600">
                        {response.llm_system_prompt ?? "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-zinc-50 p-4">
                      <p className="text-sm font-semibold text-zinc-900">User Prompt</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600">
                        {response.llm_user_prompt ?? "—"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-zinc-500">
                    Created:{" "}
                    {response.created_datetime_utc
                      ? new Date(response.created_datetime_utc).toLocaleString()
                      : "—"}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-zinc-500">
                No LLM model responses found.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
