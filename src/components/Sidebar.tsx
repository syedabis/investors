"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/home", label: "Dashboard", icon: "dashboard" },
  { href: "/predict", label: "Performance", icon: "monitoring" },
  { href: "/history", label: "History", icon: "history" },
];

export function Sidebar({ username, name }: { username: string; name: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full z-40 bg-surface-container-lowest backdrop-blur-xl border-r border-white/10 shadow-lg shadow-primary/5 w-64 pt-6 pb-6">
        {/* Branding */}
        <div className="px-md mb-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-xl bg-surface-container-highest border border-outline-variant mb-3 flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-primary text-3xl">trending_up</span>
          </div>
          <h1 className="font-headline-sm text-headline-sm text-primary mb-0.5 tracking-tight">Capital Command</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Venture Partner</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-sm flex flex-col gap-1">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-secondary-container/20 text-primary border-r-4 border-primary"
                    : "text-on-surface-variant/80 hover:bg-surface-container-high hover:translate-x-1"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
                <span className="font-label-md text-label-md">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-sm mt-auto flex flex-col gap-4">
          <button className="w-full bg-primary hover:bg-primary-fixed text-on-primary font-label-md text-label-md py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(75,226,119,0.3)] hover:shadow-[0_0_25px_rgba(75,226,119,0.5)]">
            <span className="material-symbols-outlined text-sm">search</span>
            Discover Startups
          </button>

          <div className="border-t border-white/5 pt-4">
            <div className="px-4 py-2 mb-1">
              <p className="font-label-sm text-label-sm text-on-surface-variant/60 uppercase tracking-widest">Signed in as</p>
              <p className="font-body-md text-body-md text-on-surface font-semibold mt-0.5 capitalize">{name}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">{username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant/60 hover:text-error hover:bg-surface-container-high transition-all font-label-md text-label-md"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <nav className="md:hidden bg-surface/80 backdrop-blur-md border-b border-white/10 shadow-sm fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-margin-mobile h-16 w-full">
        <span className="font-headline-sm text-headline-sm font-bold text-primary">AIVenture</span>
        <div className="flex items-center gap-xs">
          <button onClick={handleLogout} className="text-on-surface-variant hover:text-error transition-colors p-2">
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-lg border-t border-white/10 w-full">
        <div className="flex justify-around items-center h-16 px-2">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${
                  active ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {active && <div className="absolute top-0 w-8 h-1 bg-primary rounded-b-full" />}
                <span className="material-symbols-outlined mb-1 text-[22px]">{icon}</span>
                <span className="text-[10px] font-medium font-label-sm">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
