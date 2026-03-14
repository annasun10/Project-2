import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function createAllowedDomain(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const apex_domain = String(formData.get("apex_domain") ?? "").trim();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!apex_domain) return;

  await supabase.from("allowed_signup_domains").insert({
    apex_domain,
  });

  revalidatePath("/admin/access");
}

async function updateAllowedDomain(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const apex_domain = String(formData.get("apex_domain") ?? "").trim();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!id || !apex_domain) return;

  await supabase
    .from("allowed_signup_domains")
    .update({ apex_domain })
    .eq("id", id);

  revalidatePath("/admin/access");
}

async function deleteAllowedDomain(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!id) return;

  await supabase.from("allowed_signup_domains").delete().eq("id", id);

  revalidatePath("/admin/access");
}

async function createWhitelistedEmail(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const email_address = String(formData.get("email_address") ?? "").trim();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!email_address) return;

  await supabase.from("whitelist_email_addresses").insert({
    email_address,
  });

  revalidatePath("/admin/access");
}

async function updateWhitelistedEmail(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const email_address = String(formData.get("email_address") ?? "").trim();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!id || !email_address) return;

  await supabase
    .from("whitelist_email_addresses")
    .update({ email_address })
    .eq("id", id);

  revalidatePath("/admin/access");
}

async function deleteWhitelistedEmail(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!id) return;

  await supabase.from("whitelist_email_addresses").delete().eq("id", id);

  revalidatePath("/admin/access");
}

export default async function AccessPage() {
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

  const { data: users } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, is_superadmin, created_datetime_utc")
    .order("created_datetime_utc", { ascending: false });

  const { data: allowedDomains } = await supabase
    .from("allowed_signup_domains")
    .select("*")
    .order("created_datetime_utc", { ascending: false });

  const { data: whitelistedEmails } = await supabase
    .from("whitelist_email_addresses")
    .select("*")
    .order("created_datetime_utc", { ascending: false });

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 flex items-center justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <div>
            <p className="text-sm font-medium text-pink-600">Admin Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
              Access
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Manage users, allowed signup domains, and whitelisted e-mail addresses.
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
            <h2 className="text-lg font-semibold text-zinc-900">Users</h2>
            <p className="mt-1 text-sm text-zinc-600">
              View all profiles in the system.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Superadmin</th>
                  <th className="px-6 py-4 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u.id} className="border-t border-zinc-100">
                      <td className="px-6 py-4 text-zinc-900">
                        {u.first_name || u.last_name
                          ? `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim()
                          : "No name"}
                      </td>
                      <td className="px-6 py-4 text-zinc-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            u.is_superadmin
                              ? "bg-green-100 text-green-700"
                              : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          {u.is_superadmin ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-600">
                        {u.created_datetime_utc
                          ? new Date(u.created_datetime_utc).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <h2 className="text-lg font-semibold text-zinc-900">
              Allowed Signup Domains
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Add and manage domains that are allowed to sign up.
            </p>

            <form action={createAllowedDomain} className="mt-4 flex gap-3">
              <input
                name="apex_domain"
                type="text"
                placeholder="example.com"
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
              {allowedDomains && allowedDomains.length > 0 ? (
                allowedDomains.map((domain) => (
                  <div
                    key={domain.id}
                    className="rounded-2xl border border-zinc-200 p-4"
                  >
                    <form action={updateAllowedDomain} className="grid gap-3">
                      <input type="hidden" name="id" value={domain.id} />
                      <input
                        name="apex_domain"
                        type="text"
                        defaultValue={domain.apex_domain ?? ""}
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

                    <form action={deleteAllowedDomain} className="mt-3">
                      <input type="hidden" name="id" value={domain.id} />
                      <button
                        type="submit"
                        className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </form>

                    <p className="mt-3 text-xs text-zinc-500">
                      Created:{" "}
                      {domain.created_datetime_utc
                        ? new Date(domain.created_datetime_utc).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-500">
                  No allowed signup domains found.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <h2 className="text-lg font-semibold text-zinc-900">
              Whitelisted E-mail Addresses
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Add and manage individual e-mail addresses that are allowed access.
            </p>

            <form action={createWhitelistedEmail} className="mt-4 flex gap-3">
              <input
                name="email_address"
                type="email"
                placeholder="name@example.com"
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
              {whitelistedEmails && whitelistedEmails.length > 0 ? (
                whitelistedEmails.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-2xl border border-zinc-200 p-4"
                  >
                    <form action={updateWhitelistedEmail} className="grid gap-3">
                      <input type="hidden" name="id" value={entry.id} />
                      <input
                        name="email_address"
                        type="email"
                        defaultValue={entry.email_address ?? ""}
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

                    <form action={deleteWhitelistedEmail} className="mt-3">
                      <input type="hidden" name="id" value={entry.id} />
                      <button
                        type="submit"
                        className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </form>

                    <p className="mt-3 text-xs text-zinc-500">
                      Created:{" "}
                      {entry.created_datetime_utc
                        ? new Date(entry.created_datetime_utc).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-500">
                  No whitelisted e-mail addresses found.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}