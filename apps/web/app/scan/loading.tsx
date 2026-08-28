"use client";

import { motion } from "framer-motion";
import { SkeletonHero } from "@/components/Skeleton";

function Pulse({ className }: { className?: string }) {
  return (
    <motion.div
      className={`rounded-xl bg-slate-200/70 dark:bg-slate-700/50 ${className ?? ""}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function ScanLoading() {
  return (
    <motion.section
      className="space-y-8 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SkeletonHero />

      <div className="flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-slate-100/50 p-4 dark:border-slate-800/60 dark:bg-slate-800/30">
        <Pulse className="mt-0.5 h-5 w-5 shrink-0 rounded" />
        <div className="space-y-2 flex-1">
          <Pulse className="h-3 w-48" />
          <Pulse className="h-3 w-full" />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/60 bg-white/70 p-6 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70 space-y-4">
        <div className="flex gap-3">
          <Pulse className="h-12 flex-1 rounded-2xl" />
          <Pulse className="h-12 flex-1 rounded-2xl" />
        </div>
        <Pulse className="h-48 w-full rounded-2xl" />
        <Pulse className="h-12 w-full rounded-2xl" />
      </div>
    </motion.section>
  );
}
