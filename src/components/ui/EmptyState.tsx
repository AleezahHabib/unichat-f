import * as React from "react";
import { MessageSquareOff } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-2/40 border border-dashed border-border rounded-[14px]">
      <div className="p-3 bg-surface rounded-full text-ink-muted mb-4 border border-border shadow-xs">
        {icon || <MessageSquareOff className="w-8 h-8" />}
      </div>
      <h3 className="text-base font-semibold font-headline text-ink mb-1">
        {title}
      </h3>
      <p className="text-sm text-ink-muted max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
