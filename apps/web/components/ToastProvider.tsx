"use client";

import { createContext, useContext, useCallback, useState, useEffect, useRef } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: {
    container: "border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15",
    icon: "text-emerald-500",
    title: "text-emerald-700 dark:text-emerald-300",
    bar: "bg-emerald-500",
  },
  error: {
    container: "border-rose-500/30 bg-rose-500/10 dark:bg-rose-500/15",
    icon: "text-rose-500",
    title: "text-rose-700 dark:text-rose-300",
    bar: "bg-rose-500",
  },
  warning: {
    container: "border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15",
    icon: "text-amber-500",
    title: "text-amber-700 dark:text-amber-300",
    bar: "bg-amber-500",
  },
  info: {
    container: "border-sky-500/30 bg-sky-500/10 dark:bg-sky-500/15",
    icon: "text-sky-500",
    title: "text-sky-700 dark:text-sky-300",
    bar: "bg-sky-500",
  },
};

const DURATION = 4000;

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const style = STYLES[toast.type];
  const Icon = ICONS[toast.type];
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Animate in
    const t = setTimeout(() => setVisible(true), 10);

    // Progress countdown
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current!);
        setVisible(false);
        setTimeout(() => onRemove(toast.id), 300);
      }
    }, 30);

    return () => {
      clearTimeout(t);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [toast.id, onRemove]);

  return (
    <div
      className={`relative flex w-80 max-w-full items-start gap-3 overflow-hidden rounded-2xl border p-4 shadow-xl backdrop-blur-xl transition-all duration-300 ${style.container} ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.icon}`} />
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-bold ${style.title}`}>{toast.title}</p>
        {toast.message && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onRemove(toast.id), 300);
        }}
        className="ml-1 shrink-0 rounded-lg p-0.5 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
      >
        <X className="h-4 w-4" />
      </button>
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-black/5 dark:bg-white/5">
        <div
          className={`h-full transition-none ${style.bar}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const success = useCallback((title: string, message?: string) => toast("success", title, message), [toast]);
  const error = useCallback((title: string, message?: string) => toast("error", title, message), [toast]);
  const warning = useCallback((title: string, message?: string) => toast("warning", title, message), [toast]);
  const info = useCallback((title: string, message?: string) => toast("info", title, message), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
