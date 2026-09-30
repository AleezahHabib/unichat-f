import * as React from "react";

export interface BadgeProps {
  variant?: "primary" | "ai" | "live" | "danger" | "slack" | "discord" | "neutral";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "neutral", children, className = "" }: BadgeProps) {
  const variantStyles = {
    neutral: "bg-surface-2 text-ink-muted border border-border",
    primary: "bg-primary/10 text-primary border border-primary/20",
    ai: "bg-ai/10 text-ai border border-ai/20",
    live: "bg-live/10 text-live border border-live/20",
    danger: "bg-danger/10 text-danger border border-danger/20",
    slack: "bg-[#4A154B] text-white",
    discord: "bg-[#5865F2] text-white",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
