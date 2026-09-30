import * as React from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

export interface ToastProps {
  type?: "info" | "success" | "error";
  title?: string;
  message: string;
  onClose?: () => void;
}

export function Toast({ type = "info", title, message, onClose }: ToastProps) {
  const icons = {
    info: <Info className="w-5 h-5 text-primary shrink-0" />,
    success: <CheckCircle className="w-5 h-5 text-live shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-danger shrink-0" />,
  };

  return (
    <div
      role="alert"
      className="flex items-start gap-3 p-4 bg-surface text-ink border border-border rounded-[12px] shadow-lg max-w-sm w-full"
    >
      {icons[type]}
      <div className="flex-1">
        {title && <h4 className="text-sm font-semibold">{title}</h4>}
        <p className="text-xs text-ink-muted leading-relaxed">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-ink-muted hover:text-ink p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
