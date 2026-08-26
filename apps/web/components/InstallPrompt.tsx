"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("leaflens-install-dismissed") === "1") {
        setDismissed(true);
        return;
      }
    } catch {}

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!dismissed) setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setVisible(false);
      setDeferredPrompt(null);
    });
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [dismissed]);

  if (!visible || !deferredPrompt || dismissed) return null;

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferredPrompt(null);
  }

  function dismiss() {
    setVisible(false);
    setDismissed(true);
    try {
      localStorage.setItem("leaflens-install-dismissed", "1");
    } catch {}
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-6 sm:max-w-sm">
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-white p-4 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
          <Smartphone className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900 dark:text-white">Install LeafLens</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Akses offline & lebih cepat seperti aplikasi native.</p>
        </div>
        <button
          onClick={install}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
        >
          <Download className="h-3.5 w-3.5" /> Install
        </button>
        <button onClick={dismiss} aria-label="Tutup" className="p-1 text-slate-400 hover:text-slate-600">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
