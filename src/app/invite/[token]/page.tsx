"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/authentication/useAuth";
import { getInvitePreview, acceptInvite, InvitePreviewResponse } from "@/features/workspaces-and-channels/api";
import { LogOut, UserCircle, CheckCircle } from "lucide-react";

export default function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const router = useRouter();
  const { user, isLoading: isAuthLoading, logout } = useAuth();

  const [preview, setPreview] = useState<InvitePreviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [alreadyMember, setAlreadyMember] = useState(false);
  const [joinedWorkspaceId, setJoinedWorkspaceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPreview() {
      try {
        const data = await getInvitePreview(token);
        setPreview(data);
      } catch (err: any) {
        setError(err.message || "Invalid or expired invite link");
      } finally {
        setIsLoading(false);
      }
    }
    loadPreview();
  }, [token]);

  const handleSwitchAccount = () => {
    // Log out current user, redirect to login with this invite as the post-login destination
    logout();
    // logout() navigates to /login — we store the redirect in the URL
    router.push(`/login?redirect=/invite/${token}`);
  };

  const handleAccept = async () => {
    if (!user) {
      router.push(`/login?redirect=/invite/${token}`);
      return;
    }

    setIsAccepting(true);
    setError(null);
    try {
      const res = await acceptInvite(token);
      // Check if this was an already-member case (backend is idempotent)
      // We detect it by checking if we were already in the workspace list
      setJoinedWorkspaceId(res.workspace_id);
      setAlreadyMember(false);
    } catch (err: any) {
      if (err.code === "already_member") {
        setAlreadyMember(true);
      } else {
        setError(err.message || "Failed to accept invite");
      }
      setIsAccepting(false);
    }
  };

  if (isLoading || isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect to workspace on successful join
  if (joinedWorkspaceId) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)] text-[var(--color-ink)]">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-[var(--font-headline)]">You&apos;re in!</h1>
            <p className="text-sm text-[var(--color-ink-muted)] mt-1">
              Joined as <strong>{user?.name}</strong> ({user?.email})
            </p>
          </div>
          <Link
            href={`/workspace/${joinedWorkspaceId}`}
            className="block w-full py-3 px-6 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold text-sm transition shadow-md"
          >
            Open Workspace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)] text-[var(--color-ink)]">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl text-center space-y-6">
        {error ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-[var(--color-danger)] flex items-center justify-center mx-auto text-xl">
              ⚠️
            </div>
            <h1 className="text-xl font-bold font-[var(--font-headline)]">Invite Error</h1>
            <p className="text-sm text-[var(--color-ink-muted)]">{error}</p>
            <Link href="/workspaces" className="text-xs text-[var(--color-primary)] hover:underline">
              Go to your workspaces
            </Link>
          </div>
        ) : (
          <>
            {/* Workspace identity */}
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md">
              {preview?.workspace_name[0].toUpperCase() || "W"}
            </div>

            <div>
              <h1 className="text-2xl font-bold font-[var(--font-headline)]">
                You&apos;ve been invited to join{" "}
                <span className="text-[var(--color-primary)]">{preview?.workspace_name}</span>
              </h1>
              <p className="text-sm text-[var(--color-ink-muted)] mt-2">
                Invited by {preview?.inviter_name}
              </p>
            </div>

            {/* ALWAYS show which account will join — the key transparency fix */}
            {user && !preview?.is_expired && (
              <div className="p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-left space-y-3">
                <p className="text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider">
                  Joining as
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ backgroundColor: user.avatar_color || "var(--color-primary)" }}
                  >
                    {user.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[var(--color-ink)] truncate">{user.name}</div>
                    <div className="text-xs text-[var(--color-ink-muted)] truncate">{user.email}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-[10px] uppercase shrink-0">
                    Member
                  </span>
                </div>
                <button
                  onClick={handleSwitchAccount}
                  className="flex items-center gap-1.5 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition cursor-pointer w-full"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Not you? Switch account
                </button>
              </div>
            )}

            {/* Already a member notice */}
            {alreadyMember && (
              <div className="p-3 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-sm font-semibold">
                You&apos;re already a member of this workspace.
              </div>
            )}

            {preview?.is_expired ? (
              <div className="p-3 rounded-xl bg-red-500/10 text-[var(--color-danger)] text-xs font-semibold">
                This invite link has expired.
              </div>
            ) : user ? (
              <button
                onClick={handleAccept}
                disabled={isAccepting}
                className="w-full py-3 px-6 rounded-xl bg-[var(--color-primary)] hover:opacity-90 active:scale-[0.98] text-white font-semibold text-sm transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <UserCircle className="w-4 h-4" />
                {isAccepting ? "Joining..." : `Join as ${user.name}`}
              </button>
            ) : (
              <Link
                href={`/login?redirect=/invite/${token}`}
                className="block w-full py-3 px-6 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold text-sm transition shadow-md text-center"
              >
                Log in to Join
              </Link>
            )}
          </>
        )}
      </div>
    </main>
  );
}
