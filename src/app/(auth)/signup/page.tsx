"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignupForm } from "@/features/authentication/components/SignupForm";
import { useAuth } from "@/features/authentication/useAuth";

function SignupContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || undefined;

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(redirect || "/workspaces");
    }
  }, [user, isLoading, router, redirect]);

  if (isLoading || user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)]">
        <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)] relative overflow-hidden">
      {/* Decorative ambient background gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[var(--color-primary)]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[var(--color-live)]/15 rounded-full blur-3xl pointer-events-none" />

      <SignupForm redirectTo={redirect} />
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)]">
          <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </main>
      }
    >
      <SignupContent />
    </Suspense>
  );
}

