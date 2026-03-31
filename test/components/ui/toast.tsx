"use client";

import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "error" | "info" | "warning";

export type ToastAction = {
  label: string;
  onClick: () => void | Promise<void>;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
};

export type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  actions?: ToastAction[];
};

type ToastItem = ToastOptions & {
  id: number;
  variant: ToastVariant;
  duration: number;
  actions: ToastAction[];
};

type ToastContextValue = {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
let nextToastId = 0;

const variantStyles: Record<
  ToastVariant,
  {
    containerClassName: string;
    iconClassName: string;
    Icon: LucideIcon;
  }
> = {
  default: {
    containerClassName: "border-slate-200 bg-white text-slate-950",
    iconClassName: "bg-slate-100 text-slate-700",
    Icon: Info,
  },
  success: {
    containerClassName: "border-emerald-200 bg-emerald-50 text-emerald-950",
    iconClassName: "bg-emerald-100 text-emerald-700",
    Icon: CheckCircle2,
  },
  error: {
    containerClassName: "border-rose-200 bg-rose-50 text-rose-950",
    iconClassName: "bg-rose-100 text-rose-700",
    Icon: AlertCircle,
  },
  info: {
    containerClassName: "border-blue-200 bg-blue-50 text-blue-950",
    iconClassName: "bg-blue-100 text-blue-700",
    Icon: Info,
  },
  warning: {
    containerClassName: "border-amber-200 bg-amber-50 text-amber-950",
    iconClassName: "bg-amber-100 text-amber-700",
    Icon: AlertTriangle,
  },
};

const defaultDurations: Record<ToastVariant, number> = {
  default: 4500,
  success: 3800,
  error: 6000,
  info: 4500,
  warning: 5000,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<number, number>>(new Map());

  function dismiss(id: number) {
    setToasts((current) => current.filter((toast) => toast.id !== id));

    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }

  function toast(options: ToastOptions) {
    const id = ++nextToastId;
    const variant = options.variant ?? "default";
    const duration = options.duration ?? defaultDurations[variant];
    const nextToast: ToastItem = {
      id,
      title: options.title,
      description: options.description,
      variant,
      duration,
      actions: options.actions ?? [],
    };

    setToasts((current) => [nextToast, ...current].slice(0, 4));

    if (duration > 0) {
      const timer = window.setTimeout(() => {
        dismiss(id);
      }, duration);

      timersRef.current.set(id, timer);
    }

    return id;
  }

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current.clear();
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4 sm:justify-end sm:px-6 lg:px-8"
      >
        <div className="flex w-full max-w-sm flex-col gap-3">
          {toasts.map((toastItem) => {
            const { Icon, containerClassName, iconClassName } =
              variantStyles[toastItem.variant];

            return (
              <div
                key={toastItem.id}
                className={cn(
                  "pointer-events-auto overflow-hidden rounded-2xl border px-4 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.14)] backdrop-blur-sm transition-all",
                  containerClassName
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 grid size-9 shrink-0 place-items-center rounded-full",
                      iconClassName
                    )}
                  >
                    <Icon className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-5">
                      {toastItem.title}
                    </p>
                    {toastItem.description ? (
                      <p className="mt-1 text-sm leading-5 text-current/80">
                        {toastItem.description}
                      </p>
                    ) : null}

                    {toastItem.actions.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {toastItem.actions.map((action, actionIndex) => (
                          <Button
                            key={`${toastItem.id}-${actionIndex}`}
                            type="button"
                            size={action.size ?? "sm"}
                            variant={action.variant ?? "outline"}
                            onClick={() => {
                              dismiss(toastItem.id);
                              void action.onClick();
                            }}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => dismiss(toastItem.id)}
                    className="rounded-full p-1 text-current/60 transition hover:bg-black/5 hover:text-current focus:outline-none focus:ring-2 focus:ring-current/20"
                    aria-label="Fermer la notification"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider.");
  }

  return context;
}
