"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Camera, History } from "lucide-react";

export default function NavigationLinks() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/scan", label: "Scan Daun", icon: Camera },
    { href: "/history", label: "Riwayat", icon: History },
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all sm:text-sm ${
              isActive
                ? "bg-emerald-500/10 text-emerald-600 shadow-sm dark:bg-emerald-500/20 dark:text-emerald-400"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? "text-emerald-500" : ""}`} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
