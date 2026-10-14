"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { FistaChatLogo } from "@/components/ui/FistaChatLogo";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 24);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full pointer-events-none h-16">
      <div className="w-full h-full relative">
        <nav
          aria-label="Main Navigation"
          className={`pointer-events-auto mx-auto navbar-pill-transition ${
            scrolled
              ? "max-w-[880px] w-[calc(100%-2rem)] translate-y-4 sm:translate-y-5 px-5 sm:px-6 h-[52px] sm:h-[54px] rounded-full bg-[color-mix(in_srgb,var(--color-surface)_85%,transparent)] backdrop-blur-[12px] border border-border navbar-pill-floating"
              : "w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-16 bg-transparent border-b border-transparent shadow-none rounded-none translate-y-0"
          }`}
        >
          <div
            className={`w-full h-full flex items-center justify-between transition-[max-width] duration-[250ms] ease-out ${
              scrolled ? "max-w-full" : "max-w-7xl mx-auto"
            }`}
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary rounded-[10px] shrink-0"
            >
              <FistaChatLogo className="w-8 h-8" />
              <span className="font-headline font-bold text-xl tracking-tight text-ink">
                FistaChat
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-ink-muted">
              <Link
                href="/#features"
                className="hover:text-ink focus:outline-none focus:ring-2 focus:ring-primary rounded-sm transition-colors"
              >
                Features
              </Link>
              <Link
                href="/#integrations"
                className="hover:text-ink focus:outline-none focus:ring-2 focus:ring-primary rounded-sm transition-colors"
              >
                Integrations
              </Link>
              <Link
                href="/#assistant"
                className="hover:text-ink focus:outline-none focus:ring-2 focus:ring-primary rounded-sm transition-colors"
              >
                Assistant
              </Link>
              <Link
                href="/#faq"
                className="hover:text-ink focus:outline-none focus:ring-2 focus:ring-primary rounded-sm transition-colors"
              >
                FAQ
              </Link>
            </div>

            {/* Action Controls */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4 shrink-0">
              <ThemeToggle />
              <Link
                href="/login"
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-ink hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-[10px] transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-white bg-primary hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-[10px] shadow-sm transition-all"
              >
                Get started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2 shrink-0">
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-ink rounded-[10px] hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div
            className={`md:hidden pointer-events-auto mx-auto mt-2 transition-all duration-200 animate-fadeIn ${
              scrolled
                ? "w-[calc(100%-2rem)] max-w-[880px] rounded-2xl bg-surface/95 backdrop-blur-md border border-border px-5 pt-3 pb-6 space-y-4 shadow-xl"
                : "w-full max-w-7xl px-4 sm:px-6 bg-surface/95 backdrop-blur-md border-b border-border pt-3 pb-6 space-y-4 shadow-lg"
            }`}
          >
            <nav className="flex flex-col space-y-3 font-medium text-ink-muted">
              <Link
                href="/#features"
                onClick={() => setMobileOpen(false)}
                className="py-1 text-ink hover:text-primary transition-colors"
              >
                Features
              </Link>
              <Link
                href="/#integrations"
                onClick={() => setMobileOpen(false)}
                className="py-1 text-ink hover:text-primary transition-colors"
              >
                Integrations
              </Link>
              <Link
                href="/#assistant"
                onClick={() => setMobileOpen(false)}
                className="py-1 text-ink hover:text-primary transition-colors"
              >
                Assistant
              </Link>
              <Link
                href="/#faq"
                onClick={() => setMobileOpen(false)}
                className="py-1 text-ink hover:text-primary transition-colors"
              >
                FAQ
              </Link>
            </nav>
            <div className="pt-2 border-t border-border flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-ink bg-surface-2 hover:bg-border rounded-[10px] transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-white bg-primary hover:opacity-95 rounded-[10px] shadow-sm transition-all"
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}