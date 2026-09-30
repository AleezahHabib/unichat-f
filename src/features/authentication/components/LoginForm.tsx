"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../useAuth";
import { UniChatLogo } from "@/components/ui/UniChatLogo";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password }, redirectTo);
    } catch (err: any) {
      const code = err?.code;
      const status = err?.status;
      const message = err?.message;

      if (code === "invalid_credentials" || status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (code === "NETWORK_ERROR" || status === 0) {
        setError(message || "Network error: Unable to connect to backend server.");
      } else {
        setError(message || "Sign in failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all">
      {/* Top ambient highlight line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-ai)] to-[var(--color-live)]" />

      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-lg p-1">
          <UniChatLogo className="w-10 h-10 transition-transform group-hover:scale-105" />
          <span className="text-2xl font-black tracking-tight text-[var(--color-ink)] font-[var(--font-headline)]">
            UniChat
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-ink)] tracking-tight font-[var(--font-headline)]">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-[var(--color-ink-muted)]">
          Sign in to access your unified team workspace
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-[var(--color-danger)] text-sm flex items-center gap-3 animate-sublineSwap"
        >
          <AlertCircle className="w-5 h-5 shrink-0 text-[var(--color-danger)]" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] pointer-events-none" />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wider">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] pointer-events-none" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-11 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-md p-0.5 transition"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-xl bg-[var(--color-primary)] hover:opacity-90 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 group cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-ink-muted)]">
        Don&apos;t have an account?{" "}
        <Link
          href={redirectTo ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : "/signup"}
          className="font-semibold text-[var(--color-primary)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded px-1"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}

