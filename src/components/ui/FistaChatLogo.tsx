import * as React from "react";

export function FistaChatLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 8C6 4.68629 8.68629 2 12 2H28C31.3137 2 34 4.68629 34 8V22C34 25.3137 31.3137 28 28 28H16L8 35V28H12C8.68629 28 6 25.3137 6 22V8Z"
        fill="currentColor"
        className="text-primary"
      />
      <path d="M12 11H28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 16H24" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 21H18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
