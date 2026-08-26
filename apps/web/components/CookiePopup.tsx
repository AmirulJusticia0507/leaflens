"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";

const CONSENT_KEY = "leaflens-cookie-consent"; // localStorage — permanen
const LATER_KEY = "leaflens-cookie-later"; // sessionStorage — sampai sesi berakhir

const cookie_popup = {
  aria_label: "Kebijakan privasi dan cookies",
  title: "Kebijakan Privasi & Cookies",
  description:
    "Kami menggunakan cookies untuk menyimpan preferensi, meningkatkan pengalaman pengguna, dan membantu memahami penggunaan layanan pada portal ini.",
  later: "Nanti",
  accept: "Setuju",
};

export default function CookiePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(CONSENT_KEY) === "accepted") return;
      if (sessionStorage.getItem(LATER_KEY) === "later") return;
    } catch {}
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  function handleAccept() {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {}
    setVisible(false);
  }

  function handleLater() {
    try {
      sessionStorage.setItem(LATER_KEY, "later");
    } catch {}
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="dialog"
          aria-label={cookie_popup.aria_label}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-x-4 bottom-4 z-[60] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-md"
        >
          <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-black/30">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/30">
                <Cookie className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  {cookie_popup.title}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {cookie_popup.description}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2.5">
              <button
                onClick={handleLater}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {cookie_popup.later}
              </button>
              <button
                onClick={handleAccept}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 transition-all hover:brightness-105 active:scale-95"
              >
                {cookie_popup.accept}
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
