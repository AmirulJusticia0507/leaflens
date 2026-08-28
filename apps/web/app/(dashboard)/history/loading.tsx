"use client";

import { motion } from "framer-motion";
import { SkeletonChart, SkeletonList } from "@/components/Skeleton";

function Pulse({ className }: { className?: string }) {
  return (
    <motion.div
      className={`rounded-xl bg-slate-200/70 dark:bg-slate-700/50 ${className ?? ""}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function HistoryLoading() {
  return (
    <motion.section
      className="space-y-8 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-3xl border border-slate-200/60 bg-white/70 p-6 sm:p-8 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Pulse className="h-14 w-14 shrink-0 rounded-2xl" />
            <div className="space-y-2">
              <Pulse className="h-7 w-48" />
              <Pulse className="h-4 w-64" />
            </div>
          </div>
          <div className="flex gap-2">
            <Pulse className="h-8 w-32 rounded-full" />
            <Pulse className="h-8 w-36 rounded-full" />
          </div>
        </div>
      </div>

      <SkeletonChart />
      <SkeletonList count={5} />
    </motion.section>
  );
}
