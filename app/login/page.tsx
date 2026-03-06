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
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white/90 p-8 shadow-xl backdrop-blur">
        <div className="mb-8">
          <p className="text-sm font-medium text-zinc-500">Admin Area</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            Welcome back
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Sign in with your Google account to access the admin dashboard.
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Continue with Google
        </button>

        <p className="mt-4 text-center text-xs text-zinc-500">
          Only approved superadmins can continue.
        </p>
      </div>
    </main>
  );
}