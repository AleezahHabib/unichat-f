"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getWorkspaceMembers,
  deleteWorkspace,
  leaveWorkspace,
  removeWorkspaceMember,
  WorkspaceMember,
} from "@/features/workspaces-and-channels/api";
import { MemberList } from "@/features/workspaces-and-channels/components/MemberList";
import { InviteCard } from "@/features/workspaces-and-channels/components/InviteCard";
import { useAuth } from "@/features/authentication/useAuth";
import { Trash2, LogOut, AlertTriangle, Loader2, ShieldAlert, ArrowLeft } from "lucide-react";

export default function WorkspaceMembersPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.workspaceId;
  const { user } = useAuth();
  const router = useRouter();

  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteSection, setShowDeleteSection] = useState(false);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);

  const loadMembers = async () => {
    try {
      const list = await getWorkspaceMembers(workspaceId);
      setMembers(list);
    } catch (err: unknown) {
      console.error("Failed to load members", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [workspaceId]);

  const currentMember = members.find((m) => m.user_id === user?.id || m.id === user?.id);
  const isOwner = currentMember ? currentMember.role === "owner" : false;

  const handleDelete = async () => {
    if (!isOwner) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteWorkspace(workspaceId);
      router.push("/workspaces");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete workspace.";
      setDeleteError(msg);
      setIsDeleting(false);
    }
  };

  const handleLeave = async () => {
    if (isOwner) return;
    setIsLeaving(true);
    setLeaveError(null);
    try {
      await leaveWorkspace(workspaceId);
      router.push("/workspaces");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to leave workspace.";
      setLeaveError(msg);
      setIsLeaving(false);
    }
  };

  const handleRemoveMember = async (member: WorkspaceMember) => {
    await removeWorkspaceMember(workspaceId, member.user_id);
    await loadMembers();
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto space-y-8 bg-[var(--color-bg)]">
      <div>
        <Link
          href={`/workspace/${workspaceId}`}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to workspace
        </Link>
        <h1 className="text-2xl font-extrabold text-[var(--color-ink)] font-[var(--font-headline)]">
          Workspace Settings &amp; Members
        </h1>
        <p className="text-sm text-[var(--color-ink-muted)] mt-1">
          Manage workspace membership and generate invite links for new teammates
        </p>
      </div>

      <InviteCard workspaceId={workspaceId} isOwner={isOwner} />

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <MemberList
          members={members}
          isOwner={isOwner}
          currentUserId={user?.id}
          onRemoveMember={handleRemoveMember}
        />
      )}

      {/* Leave Workspace Action ?" Non-owners only */}
      {!isLoading && !isOwner && (
        <div className="border border-[var(--color-border)] rounded-2xl p-5 bg-[var(--color-surface)] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-[var(--color-ink-muted)] shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-[var(--color-ink)]">Leave Workspace</h3>
              <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                Remove your account and access from this workspace and all its channels.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowLeaveModal(true)}
            className="text-xs font-semibold text-[var(--color-danger)] border border-[var(--color-danger)]/30 hover:bg-[var(--color-danger)]/10 px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave Workspace</span>
          </button>
        </div>
      )}

      {/* Leave Workspace Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[var(--color-danger)]">
              <LogOut className="w-5 h-5" />
              <h3 className="font-bold text-lg text-[var(--color-ink)] font-[var(--font-headline)]">
                Leave Workspace?
              </h3>
            </div>
            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
              Are you sure you want to leave this workspace? You will lose access to all its channels and messages. You would need a new invite link to rejoin.
            </p>
            {leaveError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[var(--color-danger)] text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{leaveError}</span>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                disabled={isLeaving}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-surface-2)] text-[var(--color-ink)] hover:bg-[var(--color-border)] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLeave}
                disabled={isLeaving}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-danger)] text-white hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer"
              >
                {isLeaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Leaving...</span>
                  </>
                ) : (
                  "Yes, Leave Workspace"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone ?" owner only */}
      {!isLoading && isOwner && (
        <div className="border border-red-500/30 rounded-2xl overflow-hidden">
          <div className="p-5 bg-red-500/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[var(--color-danger)] shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-[var(--color-danger)]">Danger Zone</h3>
                <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                  Destructive actions ?" proceed with caution
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteSection((v) => !v)}
              className="text-xs text-[var(--color-danger)] border border-red-500/30 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition cursor-pointer font-semibold"
            >
              {showDeleteSection ? "Cancel" : "Delete Workspace"}
            </button>
          </div>

          {showDeleteSection && (
            <div className="p-5 border-t border-red-500/20 space-y-4">
              <p className="text-xs text-[var(--color-ink-muted)]">
                Deleting the workspace permanently removes all channels, messages, and member records.
                This <strong className="text-[var(--color-danger)]">cannot be undone</strong>.
              </p>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--color-ink)]">
                  Type{" "}
                  <span className="font-bold text-[var(--color-danger)] font-mono">delete</span>{" "}
                  to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="delete"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-red-500/30 text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-red-500/40 placeholder:text-[var(--color-ink-muted)]/50"
                />
              </div>
              {deleteError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[var(--color-danger)] text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{deleteError}</span>
                </div>
              )}
              <button
                onClick={handleDelete}
                disabled={deleteConfirm !== "delete" || isDeleting}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-semibold text-sm transition shadow disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Workspace Permanently
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
