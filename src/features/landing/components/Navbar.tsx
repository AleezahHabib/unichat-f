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
      setScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-surface/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary rounded-[10px]"
        >
          <FistaChatLogo className="w-8 h-8" />
          <span className="font-headline font-bold text-xl tracking-tight text-ink">
            FistaChat
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-muted">
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
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-ink hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-[10px] transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-[10px] shadow-sm transition-all"
          >
            Get started
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-ink rounded-[10px] hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-b border-border px-4 pt-2 pb-6 space-y-4 shadow-lg animate-fadeIn">
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
    </header>
  );
}
