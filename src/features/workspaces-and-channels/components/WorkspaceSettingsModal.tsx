"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Users,
  Link as LinkIcon,
  Trash2,
  Copy,
  Check,
  Loader2,
  ShieldAlert,
  Crown,
  AlertTriangle,
  UserCheck,
  Blocks,
} from "lucide-react";
import {
  getWorkspaceMembers,
  createInvite,
  deleteWorkspace,
  WorkspaceMember,
} from "../api";
import { OnlineDot } from "@/features/realtime/components/OnlineDot";

type Tab = "members" | "invite" | "danger";

interface WorkspaceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceName: string;
  currentUserId?: string;
}

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
  const [membersLoading, setMembersLoading] = useState(false);

  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const currentMember = members.find(
    (m) => m.user_id === currentUserId || m.id === currentUserId
  );
  const isOwner = currentMember?.role === "owner";

  const loadMembers = useCallback(async () => {
    if (!isOpen) return;
    setMembersLoading(true);
    try {
      const list = await getWorkspaceMembers(workspaceId);
      setMembers(list);
    } catch {
      // silently fail
    } finally {
      setMembersLoading(false);
    }
  }, [isOpen, workspaceId]);

  useEffect(() => {
    if (isOpen) {
      loadMembers();
      setActiveTab("members");
      setInviteLink(null);
      setInviteError(null);
      setDeleteConfirm("");
      setDeleteError(null);
    }
  }, [isOpen, loadMembers]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleGenerateInvite = async () => {
    setIsGenerating(true);
    setInviteError(null);
    try {
      const inv = await createInvite(workspaceId);
      const url = `${window.location.origin}/invite/${inv.token}`;
      setInviteLink(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate invite link.";
      setInviteError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm !== workspaceName) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteWorkspace(workspaceId);
      onClose();
      router.push("/workspaces");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete workspace.";
      setDeleteError(msg);
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  const tabs: { id: Tab | "integrations"; label: string; icon: React.ReactNode; isLink?: boolean }[] = [
    { id: "members", label: "Members", icon: <Users className="w-4 h-4" /> },
    { id: "invite", label: "Invite", icon: <LinkIcon className="w-4 h-4" /> },
    { id: "integrations", label: "Integrations", icon: <Blocks className="w-4 h-4" />, isLink: true },
    ...(isOwner
      ? [{ id: "danger" as Tab, label: "Danger Zone", icon: <Trash2 className="w-4 h-4" /> }]
      : []),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/40 shrink-0">
          <div>
            <h2 className="text-base font-bold text-[var(--color-ink)] font-[var(--font-headline)]">
              Workspace Settings
            </h2>
            <p className="text-xs text-[var(--color-ink-muted)] mt-0.5 truncate max-w-xs">
              {workspaceName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex border-b border-[var(--color-border)] px-4 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.isLink) {
                  onClose();
                  router.push(`/workspace/${workspaceId}/settings/${tab.id}`);
                } else {
                  setActiveTab(tab.id as Tab);
                }
              }}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                activeTab === tab.id
                  ? tab.id === "danger"
                    ? "border-[var(--color-danger)] text-[var(--color-danger)]"
                    : "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "members" && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[var(--color-ink-muted)]">
                  {members.length} member{members.length !== 1 ? "s" : ""} in this workspace
                </p>
                <button
                  onClick={loadMembers}
                  className="text-xs text-[var(--color-primary)] hover:underline cursor-pointer"
                >
                  Refresh
                </button>
              </div>
              {membersLoading ? (
                <div className="py-10 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
                </div>
              ) : members.length === 0 ? (
                <div className="py-10 text-center text-sm text-[var(--color-ink-muted)]">No members found</div>
              ) : (
                <div className="space-y-1">
                  {members.map((m) => {
                    const isCurrentUser = m.user_id === currentUserId || m.id === currentUserId;
                    return (
                      <div
                        key={m.user_id || m.id}
                        className={`flex items-center justify-between p-3 rounded-xl transition ${
                          isCurrentUser
                            ? "bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20"
                            : "hover:bg-[var(--color-surface-2)]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
                              style={{ backgroundColor: m.avatar_color || "var(--color-primary)" }}
                            >
                              {m.name ? m.name[0].toUpperCase() : "U"}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5">
                              <OnlineDot userId={m.user_id} />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-semibold text-[var(--color-ink)]">{m.name}</span>
                              {isCurrentUser && (
                                <span className="text-[10px] text-[var(--color-ink-muted)] font-medium">(you)</span>
                              )}
                              {m.role === "owner" && (
                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase">
                                  <Crown className="w-2.5 h-2.5" />
                                  Owner
                                </span>
                              )}
                              {m.role === "member" && (
                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] text-[10px] font-semibold uppercase border border-[var(--color-border)]">
                                  <UserCheck className="w-2.5 h-2.5" />
                                  Member
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-[var(--color-ink-muted)]">{m.email}</div>
                          </div>
                        </div>
                        <div className="text-[10px] text-[var(--color-ink-muted)] shrink-0 ml-2">
                          {new Date(m.joined_at).toLocaleDateString()}
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
                      Invite people to <span className="text-[var(--color-primary)]">{workspaceName}</span>
                    </p>
                    <p className="text-xs text-[var(--color-ink-muted)]">
                      Anyone who joins via this link will be added as a <strong>Member</strong> — not as an owner.
                      Links expire after <strong>7 days</strong>.
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
                          {copied ? <><Check className="w-3.5 h-3.5" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
                        </button>
                      </div>
                      <button
                        onClick={() => { setInviteLink(null); setInviteError(null); }}
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
                        <><Loader2 className="w-4 h-4 animate-spin" />Generating...</>
                      ) : (
                        <><LinkIcon className="w-4 h-4" />Generate Invite Link</>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "danger" && isOwner && (
            <div className="p-5 space-y-5">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[var(--color-danger)] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[var(--color-danger)]">Delete Workspace</p>
                  <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                    This permanently deletes <strong className="text-[var(--color-ink)]">{workspaceName}</strong>,
                    all its channels, messages, and member records.
                    This action <strong className="text-[var(--color-danger)]">cannot be undone</strong>.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--color-ink)]">
                  Type <span className="font-bold text-[var(--color-danger)] font-mono">{workspaceName}</span> to confirm
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
                  <><Loader2 className="w-4 h-4 animate-spin" />Deleting...</>
                ) : (
                  <><Trash2 className="w-4 h-4" />Delete Workspace Permanently</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}