"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Workspace, createWorkspace } from "../api";
import { Plus, UserPlus, ArrowRight, Loader2, Link as LinkIcon, Crown } from "lucide-react";
import { useAuth } from "@/features/authentication/useAuth";

interface WorkspacePickerProps {
  workspaces: Workspace[];
  onWorkspaceCreated?: (ws: Workspace) => void;
}

export function WorkspacePicker({ workspaces, onWorkspaceCreated }: WorkspacePickerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [newWsName, setNewWsName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [inviteInput, setInviteInput] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    setIsCreating(true);
    setCreateError(null);
    try {
      const ws = await createWorkspace(newWsName.trim());
      setNewWsName("");
      if (onWorkspaceCreated) onWorkspaceCreated(ws);
      router.push(`/workspace/${ws.id}`);
    } catch (err: any) {
      setCreateError(err.message || "Failed to create workspace");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinByInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError(null);
    const raw = inviteInput.trim();
    if (!raw) return;

    let token = raw;
    // Handle full URLs like http://localhost:3000/invite/XYZ or /invite/XYZ
    if (raw.includes("/invite/")) {
      const parts = raw.split("/invite/");
      token = parts[parts.length - 1].split("?")[0].split("#")[0];
    }

    if (!token) {
      setJoinError("Please enter a valid invite link or token");
      return;
    }

    router.push(`/invite/${token}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[var(--color-ink)] font-[var(--font-headline)]">
          Your Workspaces
        </h1>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Select an existing workspace, join via invite link, or create a new one to collaborate
        </p>
      </div>

      {/* List existing workspaces */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wider">
          Joined Workspaces ({workspaces.length})
        </h2>
        {workspaces.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-ink-muted)]">
            You aren&apos;t a member of any workspaces yet. Create one below or join via invite link!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workspaces.map((ws) => {
              const isOwner = user?.id === ws.owner_id;
              return (
                <button
                  key={ws.id}
                  onClick={() => router.push(`/workspace/${ws.id}`)}
                  className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-lg transition text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-2)] font-bold text-[var(--color-primary)] flex items-center justify-center text-lg shrink-0">
                      {ws.name[0].toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-primary)] transition truncate">
                          {ws.name}
                        </h3>
                        {isOwner ? (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase shrink-0">
                            <Crown className="w-2.5 h-2.5" />
                            Owner
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] text-[10px] font-semibold uppercase border border-[var(--color-border)] shrink-0">
                            Member
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-ink-muted)]">
                        {ws.member_count != null ? `${ws.member_count} member${ws.member_count !== 1 ? "s" : ""} · ` : ""}Created {new Date(ws.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--color-ink-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Cards Grid: Join vs Create */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Join Workspace via Invite */}
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UserPlus className="w-5 h-5 text-[var(--color-primary)]" />
              <h2 className="text-base font-bold text-[var(--color-ink)] font-[var(--font-headline)]">
                Join via Invite Link
              </h2>
            </div>
            <p className="text-xs text-[var(--color-ink-muted)]">
              Got an invite link from a teammate? Paste it here to join their workspace.
            </p>
          </div>

          {joinError && <p className="text-xs text-[var(--color-danger)]">{joinError}</p>}

          <form onSubmit={handleJoinByInvite} className="space-y-3">
            <div className="relative">
              <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] pointer-events-none" />
              <input
                type="text"
                value={inviteInput}
                onChange={(e) => setInviteInput(e.target.value)}
                placeholder="Paste invite link or token"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              />
            </div>
            <button
              type="submit"
              disabled={!inviteInput.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--color-surface-2)] hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-ink)] font-semibold text-xs transition border border-[var(--color-border)] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Join Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Create New Workspace */}
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Plus className="w-5 h-5 text-[var(--color-primary)]" />
              <h2 className="text-base font-bold text-[var(--color-ink)] font-[var(--font-headline)]">
                Create a New Workspace
              </h2>
            </div>
            <p className="text-xs text-[var(--color-ink-muted)]">
              Start a new space for your team or project and invite others.
            </p>
          </div>

          {createError && <p className="text-xs text-[var(--color-danger)]">{createError}</p>}

          <form onSubmit={handleCreate} className="space-y-3">
            <input
              type="text"
              required
              value={newWsName}
              onChange={(e) => setNewWsName(e.target.value)}
              placeholder="e.g. Acme Corp or Engineering"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            />
            <button
              type="submit"
              disabled={isCreating || !newWsName.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold text-xs transition shadow disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>Create Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

