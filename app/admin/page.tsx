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

  const [
    { count: totalCaptions },
    { count: publicCaptions },
    { count: featuredCaptions },
    { count: totalVotes },
    { data: topCaptions },
  ] = await Promise.all([
    supabase.from("captions").select("*", { count: "exact", head: true }),

    supabase
      .from("captions")
      .select("*", { count: "exact", head: true })
      .eq("is_public", true),

    supabase
      .from("captions")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true),

    supabase.from("caption_votes").select("*", { count: "exact", head: true }),

    supabase
      .from("captions")
      .select("id, content, like_count")
      .order("like_count", { ascending: false })
      .limit(5),
  ]);

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

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900">
            Caption Rating Statistics
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Captions" value={totalCaptions ?? 0} />
            <StatCard label="Public Captions" value={publicCaptions ?? 0} />
            <StatCard label="Featured Captions" value={featuredCaptions ?? 0} />
            <StatCard label="Total Votes" value={totalVotes ?? 0} />
          </div>
        </section>

        <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <h2 className="text-xl font-semibold text-zinc-900">
            Top Rated Captions
          </h2>

          <div className="mt-4 space-y-3">
            {topCaptions && topCaptions.length > 0 ? (
              topCaptions.map((caption) => (
                <div
                  key={caption.id}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                >
                  <p className="text-sm text-zinc-800">{caption.content}</p>
                  <p className="mt-2 text-xs font-medium text-pink-600">
                    Likes: {caption.like_count ?? 0}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">
                No captions have been rated yet.
              </p>
            )}
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          {adminSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-zinc-900">
                {section.title}
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-zinc-900">{value}</p>
    </div>
  );
}

// import Link from "next/link";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";

// const adminSections = [
//   {
//     title: "Access",
//     description: "Users, allowed signup domains, and whitelisted e-mail addresses.",
//     href: "/admin/access",
//   },
//   {
//     title: "Content",
//     description: "Images, captions, caption requests, and caption examples.",
//     href: "/admin/content",
//   },
//   {
//     title: "Humor",
//     description: "Humor flavors, flavor steps, humor mix, and terms.",
//     href: "/admin/humor",
//   },
//   {
//     title: "LLM",
//     description: "Providers, models, prompt chains, and responses.",
//     href: "/admin/llm",
//   },
// ];

// export default async function AdminDashboardPage() {
//   const supabase = await createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     redirect("/login");
//   }

//   const { data: profile } = await supabase
//     .from("profiles")
//     .select("is_superadmin")
//     .eq("id", user.id)
//     .single();

//   if (!profile?.is_superadmin) {
//     redirect("/login");
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50">
//       <div className="mx-auto max-w-6xl px-6 py-8">
//         <header className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
//           <p className="text-sm font-medium text-pink-600">Admin Dashboard</p>
//           <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
//             Control Center
//           </h1>
//           <p className="mt-2 text-sm text-zinc-600">
//             Manage your application data from grouped admin sections.
//           </p>
//         </header>

//         <div className="grid gap-6 md:grid-cols-2">
//           {adminSections.map((section) => (
//             <Link
//               key={section.title}
//               href={section.href}
//               className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 transition hover:-translate-y-0.5 hover:shadow-md"
//             >
//               <h2 className="text-xl font-semibold text-zinc-900">{section.title}</h2>
//               <p className="mt-2 text-sm text-zinc-600">{section.description}</p>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }