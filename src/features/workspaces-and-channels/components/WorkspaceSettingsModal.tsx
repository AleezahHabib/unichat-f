"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getWorkspaceMembers,
  createInvite,
  deleteWorkspace,
  leaveWorkspace,
  removeWorkspaceMember,
  WorkspaceMember,
} from "../api";
import { OnlineDot } from "@/features/realtime/components/OnlineDot";
import {
  Users,
  UserPlus,
  Trash2,
  Copy,
  Check,
  Crown,
  UserCheck,
  AlertTriangle,
  Loader2,
  Link as LinkIcon,
  ShieldAlert,
  LogOut,
  UserMinus,
} from "lucide-react";

interface WorkspaceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceName: string;
  currentUserId?: string;
}

type Tab = "members" | "invite" | "leave" | "danger";

export function WorkspaceSettingsModal({
  isOpen,
  onClose,
  workspaceId,
  workspaceName,
  currentUserId,
}: WorkspaceSettingsModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("members");

  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [isLeaving, setIsLeaving] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);

  const [targetMember, setTargetMember] = useState<WorkspaceMember | null>(null);
  const [isRemovingMember, setIsRemovingMember] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    async function load() {
      setIsLoadingMembers(true);
      try {
        const list = await getWorkspaceMembers(workspaceId);
        setMembers(list);
      } catch (err) {
        console.error("Failed to load members", err);
      } finally {
        setIsLoadingMembers(false);
      }
    }
    load();
    setInviteLink(null);
    setCopied(false);
    setInviteError(null);
    setDeleteConfirm("");
    setDeleteError(null);
    setLeaveError(null);
    setActiveTab("members");
  }, [isOpen, workspaceId]);

  if (!isOpen) return null;

  const currentMember = members.find(
    (m) => m.user_id === currentUserId || m.id === currentUserId
  );
  const isOwner = currentMember ? currentMember.role === "owner" : false;

  const handleGenerateInvite = async () => {
    setIsGenerating(true);
    setInviteError(null);
    try {
      const res = await createInvite(workspaceId);
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      setInviteLink(`${origin}/invite/${res.token}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to create invite link";
      setInviteError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!isOwner) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteWorkspace(workspaceId);
      onClose();
      router.push("/workspaces");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete workspace";
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
      onClose();
      router.push("/workspaces");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to leave workspace";
      setLeaveError(msg);
      setIsLeaving(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!targetMember) return;
    setIsRemovingMember(true);
    try {
      await removeWorkspaceMember(workspaceId, targetMember.user_id);
      setMembers((prev) => prev.filter((m) => m.user_id !== targetMember.user_id));
      setTargetMember(null);
    } catch (err) {
      console.error("Failed to remove member", err);
    } finally {
      setIsRemovingMember(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-ink)] font-[var(--font-headline)]">
              {workspaceName}
            </h2>
            <p className="text-xs text-[var(--color-ink-muted)]">
              Workspace Settings &amp; Members
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/40 px-4">
          <button
            onClick={() => setActiveTab("members")}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === "members"
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Members ({members.length})
          </button>

          <button
            onClick={() => setActiveTab("invite")}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === "invite"
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Invite
          </button>

          {!isOwner && (
            <button
              onClick={() => setActiveTab("leave")}
              className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                activeTab === "leave"
                  ? "border-[var(--color-danger)] text-[var(--color-danger)]"
                  : "border-transparent text-[var(--color-ink-muted)] hover:text-[var(--color-danger)]"
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              Leave
            </button>
          )}

          {isOwner && (
            <button
              onClick={() => setActiveTab("danger")}
              className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ml-auto ${
                activeTab === "danger"
                  ? "border-red-500 text-red-500"
                  : "border-transparent text-[var(--color-ink-muted)] hover:text-red-500"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Workspace
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto flex-1">
          {activeTab === "members" && (
            <div className="p-4 space-y-3">
              {isLoadingMembers ? (
                <div className="py-8 flex justify-center">
                  <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                  {members.map((m) => {
                    const isMe =
                      m.user_id === currentUserId || m.id === currentUserId;
                    const isMemOwner = m.role === "owner";
                    const canRemove = isOwner && !isMemOwner && !isMe;

                    return (
                      <div
                        key={m.id}
                        className="p-3.5 flex items-center justify-between hover:bg-[var(--color-surface-2)]/30 transition"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative shrink-0">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm"
                              style={{
                                backgroundColor:
                                  m.avatar_color || "var(--color-primary)",
                              }}
                            >
                              {m.name ? m.name[0].toUpperCase() : "U"}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5">
                              <OnlineDot userId={m.user_id} />
                            </div>
                          </div>
                          <div className="min-w-0 truncate">
                            <div className="font-semibold text-xs text-[var(--color-ink)] flex items-center gap-1.5">
                              <span className="truncate">{m.name}</span>
                              {isMe && (
                                <span className="px-1.5 py-0.2 rounded bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] text-[9px] font-medium">
                                  You
                                </span>
                              )}
                              {isMemOwner ? (
                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase">
                                  <Crown className="w-2.5 h-2.5" />
                                  Owner
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] text-[10px] font-semibold uppercase border border-[var(--color-border)]">
                                  <UserCheck className="w-2.5 h-2.5" />
                                  Member
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[var(--color-ink-muted)] truncate">
                              {m.email}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <div className="text-[10px] text-[var(--color-ink-muted)]">
                            {new Date(m.joined_at).toLocaleDateString()}
                          </div>
                          {canRemove && (
                            <button
                              onClick={() => setTargetMember(m)}
                              className="p-1 rounded-md text-[var(--color-ink-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition cursor-pointer"
                              title={`Remove ${m.name}`}
                            >
                              <UserMinus className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "invite" && (
            <div className="p-5 space-y-5">
              {!isOwner ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">Owner only</p>
                    <p className="text-xs mt-0.5">
                      Only the workspace owner can generate invite links. Ask your workspace owner to share one.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20">
                    <p className="text-sm font-semibold text-[var(--color-ink)] mb-1">
                      Invite people to{" "}
                      <span className="text-[var(--color-primary)]">
                        {workspaceName}
                      </span>
                    </p>
                    <p className="text-xs text-[var(--color-ink-muted)]">
                      Anyone who joins via this link will be added as a{" "}
                      <strong>Member</strong> — not as an owner. Links expire after{" "}
                      <strong>7 days</strong>.
                    </p>
                  </div>
                  {inviteError && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[var(--color-danger)] text-xs">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{inviteError}</span>
                    </div>
                  )}
                  {inviteLink ? (
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider">
                        Your invite link
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] pointer-events-none" />
                          <input
                            type="text"
                            readOnly
                            value={inviteLink}
                            className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs text-[var(--color-ink)] font-mono focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={handleCopy}
                          className="px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-semibold hover:opacity-90 active:scale-95 transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setInviteLink(null);
                          setInviteError(null);
                        }}
                        className="text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] underline cursor-pointer"
                      >
                        Generate a new link
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleGenerateInvite}
                      disabled={isGenerating}
                      className="w-full py-2.5 px-4 rounded-xl bg-[var(--color-primary)] hover:opacity-90 active:scale-[0.98] text-white font-semibold text-sm transition shadow disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-4 h-4" />
                          Generate Invite Link
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "leave" && !isOwner && (
            <div className="p-5 space-y-5">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                <LogOut className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[var(--color-ink)]">
                    Leave Workspace
                  </p>
                  <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                    Are you sure you want to leave{" "}
                    <strong className="text-[var(--color-ink)]">
                      {workspaceName}
                    </strong>
                    ? You will lose access to all its channels and messages.
                  </p>
                </div>
              </div>
              {leaveError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[var(--color-danger)] text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{leaveError}</span>
                </div>
              )}
              <button
                onClick={handleLeave}
                disabled={isLeaving}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--color-danger)] hover:opacity-90 text-white font-semibold text-sm transition shadow disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLeaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Leaving...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span>Yes, Leave Workspace</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === "danger" && isOwner && (
            <div className="p-5 space-y-5">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[var(--color-danger)] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[var(--color-danger)]">
                    Delete Workspace
                  </p>
                  <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                    This permanently deletes{" "}
                    <strong className="text-[var(--color-ink)]">
                      {workspaceName}
                    </strong>
                    , all its channels, messages, and member records. This
                    action{" "}
                    <strong className="text-[var(--color-danger)]">
                      cannot be undone
                    </strong>
                    .
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--color-ink)]">
                  Type{" "}
                  <span className="font-bold text-[var(--color-danger)] font-mono">
                    {workspaceName}
                  </span>{" "}
                  to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder={workspaceName}
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
                disabled={deleteConfirm !== workspaceName || isDeleting}
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
      </div>

      {/* Remove Member Confirmation Modal */}
      {targetMember && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[var(--color-danger)]">
              <UserMinus className="w-5 h-5" />
              <h3 className="font-bold text-lg text-[var(--color-ink)] font-[var(--font-headline)]">
                Remove Member?
              </h3>
            </div>
            <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
              Are you sure you want to remove{" "}
              <strong className="text-[var(--color-ink)]">
                {targetMember.name}
              </strong>{" "}
              from this workspace? They will be removed from all channels.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTargetMember(null)}
                disabled={isRemovingMember}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--color-surface-2)] text-[var(--color-ink)] hover:bg-[var(--color-border)] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRemoveMember}
                disabled={isRemovingMember}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--color-danger)] text-white hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer"
              >
                {isRemovingMember ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
