import Link from "next/link";
import { auth } from "@/auth";

const menuItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Feedback Inbox", href: "/inbox" },
  { name: "Trends", href: "/trends" },
  { name: "Ask LOOP (Voice AI)", href: "/ask" },
  { name: "VOC Reports", href: "/reports" },
  { name: "Live Showcase Console", href: "/showcase" },
  { name: "Settings & Team", href: "/settings" },
];

export default async function Sidebar() {
  const session = await auth();

  return (
    <aside className="hidden min-h-screen w-64 border-r border-slate-800 bg-slate-900/90 p-5 md:flex md:flex-col backdrop-blur-sm">
      <Link href="/" className="text-2xl font-bold text-white flex items-center gap-1">
        LOOP<span className="text-blue-400">.</span>
      </Link>

      <p className="mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Workspace
      </p>

      <nav className="mt-3 space-y-1 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`block rounded-lg px-3 py-2.5 text-sm transition ${
              item.name.includes("Showcase")
                ? "text-cyan-400 font-medium hover:bg-cyan-950/30 hover:text-cyan-300 border border-cyan-500/20 bg-cyan-950/10"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-4">
        {session?.user ? (
          <div>
            <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
            <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
            <div className="mt-2 inline-flex items-center rounded-md bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-900/50">
              {session.user.role}
            </div>
            <form action="/api/auth/signout" method="POST" className="mt-3">
              <button className="text-xs text-slate-500 hover:text-slate-300 w-full text-left">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-white">Your Workspace</p>
            <p className="mt-1 text-xs text-slate-500">LOOP Team</p>
          </div>
        )}
      </div>
    </aside>
  );
}