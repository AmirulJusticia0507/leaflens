"use client";

import { motion } from "framer-motion";
import { SkeletonHero, SkeletonCard, SkeletonChart, SkeletonList } from "@/components/Skeleton";

export default function DashboardLoading() {
  return (
    <motion.section
      className="space-y-8 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SkeletonHero />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <SkeletonList count={4} />
      <SkeletonChart />
      <SkeletonList count={3} />
    </motion.section>
  );
}
