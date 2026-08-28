"use client";

import { motion } from "framer-motion";
import LeafIcon from "@/components/LeafIcon";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 shadow-2xl backdrop-blur-md border border-white/30"
        >
          <LeafIcon className="h-10 w-10 fill-white text-white" />
        </motion.div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Leaf<span className="text-emerald-200">Lens</span>
          </h1>
          <p className="text-xs font-medium text-emerald-100/80">
            AI Plant Engine
          </p>
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-white"
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
