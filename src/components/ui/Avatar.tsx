import * as React from "react";

export interface AvatarProps {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ name, color = "#2F6BFF", size = "md" }: AvatarProps) {
  const initial = (name || "?").charAt(0).toUpperCase();

  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base font-medium",
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full text-white select-none ${sizeClasses[size]}`}
      style={{ backgroundColor: color }}
      aria-label={name}
    >
      {initial}
    </div>
  );
}
