"use client";

import { useActionState, useState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<any, FormData>(loginAction as any, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-3">
            The Project of Ishit & Mitali
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access the LOOP Intelligence Platform
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="p-3 text-sm text-red-400 bg-red-950/60 border border-red-800/50 rounded-lg">
              {state.error}
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@loop.dev"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20"
          >
            {isPending ? "Signing in..." : "Sign In to LOOP"}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
            Quick 1-Click Demo Logins
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials("admin@loop.dev", "password123")}
              className="px-2.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-xs font-medium text-slate-200 transition-colors text-center"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("analyst@loop.dev", "password123")}
              className="px-2.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-xs font-medium text-slate-200 transition-colors text-center"
            >
              📊 Analyst
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("viewer@loop.dev", "password123")}
              className="px-2.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-xs font-medium text-slate-200 transition-colors text-center"
            >
              👁️ Viewer
            </button>
          </div>
          <div className="mt-2 text-center">
            <span className="text-[11px] text-slate-500">
              Default Password: <code className="text-slate-400 bg-slate-800/50 px-1 py-0.5 rounded">password123</code>
            </span>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="font-medium text-blue-400 hover:text-blue-300 underline underline-offset-4">
            Create new workspace
          </a>
        </p>
      </div>
    </main>
  );
}
