"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const origin = window.location.origin;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google login error:", error.message);
      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[28px] border border-white/70 bg-white/85 p-8 shadow-xl backdrop-blur">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-600">
            Admin Area
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
            Welcome back
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Sign in with your Google account to continue to the protected admin
            dashboard.
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-zinc-800"
        >
          <span className="text-base">→</span>
          Continue with Google
        </button>

        <div className="mt-6 rounded-2xl border border-pink-100 bg-pink-50 p-4">
          <p className="text-xs leading-5 text-pink-700">
            Access is restricted to approved superadmins only.
          </p>
        </div>
      </div>
    </main>
  );
}