import Sidebar from "@/components/layout/Sidebar";
import Link from "next/link";
import { Sparkles, BarChart2, Inbox, TrendingUp, Mic, FileText, Settings, ShieldCheck } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden border-b border-slate-800 bg-slate-900/95 px-4 py-3 sticky top-0 z-50 backdrop-blur">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white flex items-center gap-1">
            LOOP<span className="text-blue-400">.</span>
            <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded ml-1">
              Ishit & Mitali
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs px-2 py-1 rounded bg-blue-600 text-white font-medium"
            >
              Switch Role
            </Link>
          </div>
        </div>

        {/* Horizontal Scrollable Mobile Menu */}
        <nav className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
          >
            <BarChart2 className="w-3.5 h-3.5 text-blue-400" /> Dashboard
          </Link>
          <Link
            href="/inbox"
            className="flex items-center gap-1 whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
          >
            <Inbox className="w-3.5 h-3.5 text-emerald-400" /> Inbox
          </Link>
          <Link
            href="/trends"
            className="flex items-center gap-1 whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Trends
          </Link>
          <Link
            href="/ask"
            className="flex items-center gap-1 whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
          >
            <Mic className="w-3.5 h-3.5 text-purple-400" /> Ask LOOP AI
          </Link>
          <Link
            href="/reports"
            className="flex items-center gap-1 whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" /> Reports
          </Link>
          <Link
            href="/showcase"
            className="flex items-center gap-1 whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-700/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Console
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-1 whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" /> Settings
          </Link>
        </nav>
      </header>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Page Area */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
