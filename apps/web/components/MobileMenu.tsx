"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Camera, History } from "lucide-react";
import Tooltip from "@/components/Tooltip";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scan", label: "Scan Daun", icon: Camera },
  { href: "/history", label: "Riwayat", icon: History },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Hamburger Button */}
      <Tooltip content={open ? "Tutup menu" : "Buka menu"} side="bottom">
        <button
          id="mobile-menu-button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-600 shadow-sm backdrop-blur-md transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Tooltip>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-down Drawer */}
      <div
        className={`fixed left-0 right-0 top-[57px] z-50 transition-all duration-300 ${
          open
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 pointer-events-none opacity-0"
        }`}
      >
        <nav className="mx-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/95">
          <div className="p-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${isActive ? "text-emerald-500" : "text-slate-400"}`}
                  />
                  {link.label}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Footer inside drawer */}
          <div className="border-t border-slate-100 p-4 dark:border-slate-800/60">
            <p className="text-center text-[10px] font-semibold text-slate-400 dark:text-slate-500">
              LeafLens AI · Powered by Llama3 Vision
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
