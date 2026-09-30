"use client";

import * as React from "react";

interface HeroBackgroundProps {
  isPaused?: boolean;
}

export function HeroBackground({ isPaused = false }: HeroBackgroundProps) {
  const [tabVisible, setTabVisible] = React.useState(true);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(true);

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      setTabVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const shouldPause = isPaused || !tabVisible || !inView;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none"
      aria-hidden="true"
    >
      {/* Subtle Atmosphere Top Glow */}
      <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-sky-top/60 via-sky-top/20 to-transparent blur-[120px] rounded-full animate-pulse-glow" />

      {/* Cloud 1 - Upper Left Drift (60s) */}
      <div
        className={`absolute top-10 left-0 w-[420px] h-[200px] opacity-40 dark:opacity-10 animate-cloud-1 ${
          shouldPause ? "animation-paused" : ""
        }`}
      >
        <svg viewBox="0 0 420 200" fill="none" className="w-full h-full">
          <filter id="blur1" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="24" />
          </filter>
          <g filter="url(#blur1)">
            <ellipse cx="210" cy="120" rx="160" ry="50" fill="var(--color-sky-top)" />
            <circle cx="140" cy="90" r="70" fill="var(--color-surface)" />
            <circle cx="260" cy="80" r="75" fill="var(--color-sky-top)" />
          </g>
        </svg>
      </div>

      {/* Cloud 2 - Upper Right Drift (90s, slowest) */}
      <div
        className={`absolute top-16 left-0 w-[500px] h-[240px] opacity-50 dark:opacity-12 animate-cloud-2 ${
          shouldPause ? "animation-paused" : ""
        }`}
      >
        <svg viewBox="0 0 500 240" fill="none" className="w-full h-full">
          <filter id="blur2" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="28" />
          </filter>
          <g filter="url(#blur2)">
            <ellipse cx="250" cy="150" rx="190" ry="60" fill="var(--color-sky-top)" />
            <circle cx="180" cy="110" r="85" fill="var(--color-sky-top)" />
            <circle cx="310" cy="95" r="95" fill="var(--color-surface)" />
          </g>
        </svg>
      </div>

      {/* Cloud 3 - Mid Canvas Fast Drift (45s, fastest) */}
      <div
        className={`absolute top-[280px] left-0 w-[460px] h-[220px] opacity-35 dark:opacity-10 animate-cloud-3 ${
          shouldPause ? "animation-paused" : ""
        }`}
      >
        <svg viewBox="0 0 460 220" fill="none" className="w-full h-full">
          <filter id="blur3" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <g filter="url(#blur3)">
            <ellipse cx="230" cy="130" rx="170" ry="55" fill="var(--color-primary)" opacity="0.2" />
            <circle cx="160" cy="95" r="75" fill="var(--color-sky-top)" />
            <circle cx="280" cy="85" r="80" fill="var(--color-surface)" />
          </g>
        </svg>
      </div>

      {/* Cloud 4 - Lower Canvas Medium Drift (75s) */}
      <div
        className={`absolute top-[420px] left-0 w-[540px] h-[260px] opacity-30 dark:opacity-08 animate-cloud-4 ${
          shouldPause ? "animation-paused" : ""
        }`}
      >
        <svg viewBox="0 0 540 260" fill="none" className="w-full h-full">
          <filter id="blur4" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
          <g filter="url(#blur4)">
            <ellipse cx="270" cy="160" rx="200" ry="65" fill="var(--color-sky-top)" />
            <circle cx="200" cy="120" r="90" fill="var(--color-surface)" />
            <circle cx="330" cy="105" r="100" fill="var(--color-sky-top)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
