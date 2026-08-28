"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import Tooltip from "@/components/Tooltip";

const STORAGE_KEY = "leaflens-theme";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {}
  }

  return (
    <Tooltip content={mounted ? (isDark ? "Mode terang" : "Mode gelap") : "Tema"} side="bottom">
      <button
        onClick={toggle}
        aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
        className="group relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-md transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/20"
      >
        {mounted && isDark ? (
          <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="h-4 w-4 text-slate-700 transition-transform duration-300 group-hover:-rotate-12 dark:text-slate-300" />
        )}
      </button>
    </Tooltip>
  );
}

