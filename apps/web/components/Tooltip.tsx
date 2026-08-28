"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

const positionMap = {
  top: { y: -6, x: 0, origin: "bottom" },
  bottom: { y: 6, x: 0, origin: "top" },
  left: { y: 0, x: -6, origin: "right" },
  right: { y: 0, x: 6, origin: "left" },
};

const animateMap = {
  top: { y: -4, x: 0 },
  bottom: { y: 4, x: 0 },
  left: { y: 0, x: -4 },
  right: { y: 0, x: 4 },
};

export default function Tooltip({
  content,
  children,
  side = "top",
  delay = 400,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timeout.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timeout.current!);
    setOpen(false);
  };

  const pos = positionMap[side];

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, ...animateMap[side] }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, ...animateMap[side] }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-slate-700 ${
              side === "top"
                ? "bottom-full left-1/2 -translate-x-1/2 mb-2"
                : side === "bottom"
                ? "top-full left-1/2 -translate-x-1/2 mt-2"
                : side === "left"
                ? "right-full top-1/2 -translate-y-1/2 mr-2"
                : "left-full top-1/2 -translate-y-1/2 ml-2"
            }`}
          >
            {content}
            <div
              className={`absolute h-2 w-2 rotate-45 bg-slate-900 dark:bg-slate-700 ${
                side === "top"
                  ? "bottom-[-4px] left-1/2 -translate-x-1/2"
                  : side === "bottom"
                  ? "top-[-4px] left-1/2 -translate-x-1/2"
                  : side === "left"
                  ? "right-[-4px] top-1/2 -translate-y-1/2"
                  : "left-[-4px] top-1/2 -translate-y-1/2"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
