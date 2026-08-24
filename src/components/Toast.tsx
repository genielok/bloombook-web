"use client";

import React, { useEffect } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, XCircle } from "lucide-react";

type ToastType = "info" | "success" | "error";

interface ToastProps {
  visible: boolean;
  type?: ToastType;
  message: string;
  description?: string;
  duration?: number; // ms
  onClose?: () => void;
  className?: string;
}

export function Toast({
  visible,
  type = "info",
  message,
  description,
  duration = 3000,
  onClose,
  className = "",
}: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(t);
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const variantClasses: Record<ToastType, string> = {
    success: "bg-emerald-100 text-emerald-700",
    error: "bg-rose-100 text-rose-700",
    info: "bg-card text-card-foreground",
  };

  const Icon = type === "success" ? CheckCircle2Icon : XCircle;

  return (
    <div className="fixed top-4 left-1/2 z-50 w-full max-w-md transform -translate-x-1/2">
      <Alert className={`${variantClasses[type]} mx-auto ${className}`}>
        <div className="flex items-center gap-2">
          <Icon />
          <div>
            <AlertTitle>{message}</AlertTitle>
            {description ? (
              <div className="text-sm text-muted-foreground">{description}</div>
            ) : null}
          </div>
        </div>
      </Alert>
    </div>
  );
}

export default Toast;
