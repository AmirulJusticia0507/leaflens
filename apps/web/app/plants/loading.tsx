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

export default function PlantsLoading() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <Pulse className="h-6 w-48" />
        <Pulse className="h-4 w-80" />
      </div>

      <div className="flex gap-3">
        <Pulse className="h-10 flex-1 rounded-xl" />
        <Pulse className="h-10 w-24 rounded-xl" />
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Pulse key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70 space-y-2"
          >
            <Pulse className="h-5 w-3/4" />
            <Pulse className="h-3 w-1/2" />
            <div className="flex gap-2 pt-1">
              <Pulse className="h-6 w-16 rounded-full" />
              <Pulse className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
