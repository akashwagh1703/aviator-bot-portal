"use client";

/**
 * Minimal toast system (context + animated stack).
 *
 * Used for elegant, non-blocking error/info alerts (AI failures, unsupported
 * speech APIs, mic permission issues, etc.). No external dependency.
 */

import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  error: AlertTriangle,
  success: CheckCircle2,
  info: Info,
};

let toastSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message, type = "info", duration = 4500) => {
      const id = ++toastSeq;
      setToasts((t) => [...t, { id, message, type }]);
      if (duration) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type] || Info;
            return (
              <motion.div
                key={t.id}
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-black/5 bg-[#1b2b1f] px-4 py-3 text-sm text-white shadow-2xl"
              >
                <Icon
                  className={
                    t.type === "error"
                      ? "mt-0.5 h-5 w-5 shrink-0 text-rose-400"
                      : t.type === "success"
                      ? "mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
                      : "mt-0.5 h-5 w-5 shrink-0 text-sky-400"
                  }
                />
                <span className="flex-1 leading-snug">{t.message}</span>
                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss notification"
                  className="rounded-md p-0.5 text-white/50 transition hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { toast: () => {}, dismiss: () => {} };
  return ctx;
}
