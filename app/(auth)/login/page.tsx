"use client";

import { useActionState, useEffect } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<any, FormData>(loginAction as any, null);

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to continue to LOOP
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div className="p-3 text-sm text-red-500 bg-red-950/50 rounded-lg">
              {state.error}
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-blue-500 py-3 font-medium text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="font-medium text-blue-400 hover:text-blue-300">
            Create one
          </a>
        </p>
      </div>
    </main>
  );
}
