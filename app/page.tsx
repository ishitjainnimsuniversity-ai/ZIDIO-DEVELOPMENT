import Link from "next/link";
import {
  BarChart2,
  Inbox,
  TrendingUp,
  Mic,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  CheckCircle2
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      {/* Top Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-2xl font-bold tracking-tight flex items-center">
            LOOP<span className="text-blue-500">.</span>
          </Link>
          <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
            The Project of Ishit & Mitali
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/ask"
            className="hidden sm:inline-block text-xs sm:text-sm font-medium text-purple-300 hover:text-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-950/30 transition border border-purple-500/20"
          >
            Ask AI Copilot
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold hover:bg-blue-500 active:bg-blue-700 transition shadow-lg shadow-blue-600/25"
          >
            1-Click Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-16 pb-12 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-blue-400">
          <Sparkles className="w-4 h-4 text-blue-400" />
          Enterprise Customer-Feedback Intelligence Platform
        </div>

        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
          Close the loop on{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            customer feedback.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-400">
          Created jointly by <strong className="text-white">Ishit Jain</strong> and <strong className="text-white">Mitali</strong>.
          Turn thousands of messy feedback entries into automated sentiment analytics, thematic trend detection, and voice-enabled AI copilot answers.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm sm:text-base font-semibold text-white hover:bg-blue-500 active:scale-95 transition shadow-xl shadow-blue-600/30"
          >
            <BarChart2 className="w-5 h-5" /> Launch Live Dashboard <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/ask"
            className="flex items-center gap-2 rounded-xl border border-purple-500/40 bg-purple-950/40 px-6 py-3.5 text-sm sm:text-base font-semibold text-purple-200 hover:bg-purple-900/50 active:scale-95 transition"
          >
            <Mic className="w-5 h-5 text-purple-400" /> Ask AI Copilot (Voice)
          </Link>

          <Link
            href="/showcase"
            className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-950/30 px-5 py-3.5 text-sm sm:text-base font-semibold text-cyan-300 hover:bg-cyan-900/40 active:scale-95 transition"
          >
            <Zap className="w-5 h-5 text-cyan-400" /> Live Demo Console
          </Link>
        </div>
      </section>

      {/* Feature Grid with Direct Navigation */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-8">
          Explore All Platform Modules (Click Any Card to Open)
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard"
            className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-blue-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-blue-950/50"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              Analytics Dashboard
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              150+ seeded customer feedback records, sentiment pie charts, and 7-day feedback volume trendlines.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-blue-400">
              Open Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/inbox"
            className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-emerald-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-emerald-950/50"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
              <Inbox className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
              Feedback Inbox
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Live full-text search, status tags (New, Reviewed, Resolved), and sentiment filters with pagination.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-emerald-400">
              Open Inbox <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/ask"
            className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-purple-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-purple-950/50"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
              Ask LOOP AI Copilot
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Ask natural-language questions with vector semantic search, voice dictation, and speech read-back.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-purple-400">
              Ask Copilot <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/trends"
            className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-amber-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-amber-950/50"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
              Thematic Trends
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Automated theme clustering for Billing, Authentication, Mobile App crashes, and Support response times.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-amber-400">
              View Trends <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/reports"
            className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-rose-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-rose-950/50"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4 text-rose-400 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
              Voice-of-Customer Reports
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Generate AI-written executive summary narratives, risk matrices, and print-ready executive briefings.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-rose-400">
              Generate Report <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/showcase"
            className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-cyan-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-cyan-950/50"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
              Showcase Console
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Interactive demo console: run simulated telemetry, test CSV ingestion, and check health diagnostics.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-cyan-400">
              Open Console <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="border-t border-slate-800/80 mt-16 py-8 text-center text-xs text-slate-500">
        <p>The Project of Ishit Jain & Mitali — LOOP Customer-Feedback Intelligence Platform</p>
        <div className="mt-3 flex justify-center gap-6 text-slate-400">
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          <Link href="/inbox" className="hover:text-white">Inbox</Link>
          <Link href="/ask" className="hover:text-white">Ask AI</Link>
          <Link href="/reports" className="hover:text-white">Reports</Link>
          <Link href="/login" className="hover:text-white">Role Switcher</Link>
        </div>
      </footer>
    </main>
  );
}