"use client";

import { useActionState, useState, useTransition } from "react";
import { loginAction } from "./actions";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<any, FormData>(loginAction as any, null);
  const [isQuickLoggingIn, startTransition] = useTransition();
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleInstantLogin = (demoEmail: string, demoPass: string, roleName: string) => {
    setActiveRole(roleName);
    setEmail(demoEmail);
    setPassword(demoPass);

    const formData = new FormData();
    formData.append("email", demoEmail);
    formData.append("password", demoPass);

    startTransition(async () => {
      await formAction(formData);
    });
  };

  const isAnyPending = isPending || isQuickLoggingIn;

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs font-semibold text-blue-400 mb-3 shadow-inner">
            The Project of Ishit & Mitali
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome to LOOP</h1>
          <p className="mt-2 text-sm text-slate-400">
            Enterprise Customer Feedback & Voice-of-Customer AI
          </p>
        </div>

        {/* Instant Access Direct Button */}
        <Link
          href="/dashboard"
          className="mb-6 flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-900/40 active:scale-98 transition text-center"
        >
          <Sparkles className="w-4 h-4" /> Enter Live Platform Directly <ArrowRight className="w-4 h-4" />
        </Link>

        {/* 1-Click Instant Login Buttons */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider text-center mb-3">
            ⚡ Quick Role Selection
          </p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              type="button"
              disabled={isAnyPending}
              onClick={() => handleInstantLogin("admin@loop.dev", "password123", "Admin")}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-blue-600/90 hover:bg-blue-500 text-xs font-medium text-white border border-blue-400/30 transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-blue-950/40"
            >
              {isAnyPending && activeRole === "Admin" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <span>👑 Admin (Ishit)</span>
              )}
            </button>

            <button
              type="button"
              disabled={isAnyPending}
              onClick={() => handleInstantLogin("analyst@loop.dev", "password123", "Analyst")}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-purple-600/90 hover:bg-purple-500 text-xs font-medium text-white border border-purple-400/30 transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-purple-950/40"
            >
              {isAnyPending && activeRole === "Analyst" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <span>📊 Analyst (Mitali)</span>
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={isAnyPending}
              onClick={() => handleInstantLogin("ishit@loop.dev", "password123", "Ishit")}
              className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-200 border border-slate-700/60 transition-all active:scale-95 disabled:opacity-50"
            >
              {isAnyPending && activeRole === "Ishit" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <span>🚀 Ishit</span>
              )}
            </button>

            <button
              type="button"
              disabled={isAnyPending}
              onClick={() => handleInstantLogin("mitali@loop.dev", "password123", "Mitali")}
              className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-200 border border-slate-700/60 transition-all active:scale-95 disabled:opacity-50"
            >
              {isAnyPending && activeRole === "Mitali" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <span>🌟 Mitali</span>
              )}
            </button>

            <button
              type="button"
              disabled={isAnyPending}
              onClick={() => handleInstantLogin("viewer@loop.dev", "password123", "Viewer")}
              className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-200 border border-slate-700/60 transition-all active:scale-95 disabled:opacity-50"
            >
              {isAnyPending && activeRole === "Viewer" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <span>👁️ Viewer</span>
              )}
            </button>
          </div>
        </div>

        <div className="relative mb-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative bg-slate-900 px-3 text-xs text-slate-500 uppercase">
            Or sign in manually
          </span>
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
            disabled={isAnyPending}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20"
          >
            {isAnyPending && !activeRole ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In to LOOP</span>
            )}
          </button>
        </form>

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
