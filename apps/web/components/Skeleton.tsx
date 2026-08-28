"use client";

import { motion } from "framer-motion";

function Pulse({ className }: { className?: string }) {
  return (
    <motion.div
      className={`rounded-xl bg-slate-200/70 dark:bg-slate-700/50 ${className ?? ""}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export function SkeletonHero() {
  return (
    <div className="rounded-3xl border border-slate-200/60 bg-slate-100/50 p-6 sm:p-8 dark:border-slate-800/60 dark:bg-slate-800/30">
      <div className="space-y-4">
        <Pulse className="h-5 w-40 rounded-full" />
        <Pulse className="h-8 w-72 sm:h-10 sm:w-96" />
        <Pulse className="h-4 w-64" />
        <div className="flex gap-3 pt-2">
          <Pulse className="h-10 w-36 rounded-2xl" />
          <Pulse className="h-10 w-32 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/60 bg-white/70 p-4 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70 ${className ?? ""}`}
    >
      <div className="space-y-3">
        <Pulse className="h-4 w-24" />
        <Pulse className="h-7 w-16" />
        <Pulse className="h-3 w-32" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white/70 p-4 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70"
        >
          <Pulse className="h-14 w-14 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Pulse className="h-4 w-3/4" />
            <Pulse className="h-3 w-1/2" />
          </div>
          <Pulse className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
      <div className="mb-4 flex items-center gap-2">
        <Pulse className="h-4 w-4 rounded-full" />
        <Pulse className="h-4 w-36" />
      </div>
      <div className="flex items-end gap-2 h-40">
        {[60, 80, 45, 90, 70, 55, 85, 40, 75, 65, 50, 80].map((h, i) => (
          <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%` }}>
            <Pulse className="h-full w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
