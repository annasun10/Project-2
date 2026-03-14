import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const adminSections = [
  {
    title: "Access",
    description: "Users, allowed signup domains, and whitelisted e-mail addresses.",
    href: "/admin/access",
  },
  {
    title: "Content",
    description: "Images, captions, caption requests, and caption examples.",
    href: "/admin/content",
  },
  {
    title: "Humor",
    description: "Humor flavors, flavor steps, humor mix, and terms.",
    href: "/admin/humor",
  },
  {
    title: "LLM",
    description: "Providers, models, prompt chains, and responses.",
    href: "/admin/llm",
  },
];

export default async function AdminDashboardPage() {
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <p className="text-sm font-medium text-pink-600">Admin Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
            Control Center
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Manage your application data from grouped admin sections.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {adminSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-zinc-900">{section.title}</h2>
              <p className="mt-2 text-sm text-zinc-600">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}