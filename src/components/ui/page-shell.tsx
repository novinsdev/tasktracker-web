"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/projects", label: "Projects" },
];

export function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-xs font-bold text-white shadow-sm">
              TT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-slate-900">
                  Task &amp; Time Tracker
                </span>
                <span className="code-chip">env: dev</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                Lightweight internal tool for engineers to manage projects and
                time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline-flex">
              Backend:{" "}
              <span className="ml-1 font-mono text-slate-700">
                Spring Boot · Render
              </span>
            </span>
            <Button variant="outline" size="sm">
              API Docs
            </Button>
          </div>
        </div>

        {/* Nav */}
        <nav className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-2 text-xs sm:text-sm">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "rounded-full px-3 py-1 transition-colors",
                    active
                      ? "bg-sky-100 text-sky-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
