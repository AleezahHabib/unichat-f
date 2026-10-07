"use client";

import React, { useState } from "react";
import { WorkspaceMember } from "../api";
import { OnlineDot } from "@/features/realtime/components/OnlineDot";
import { UserMinus, Crown, Loader2 } from "lucide-react";

interface MemberListProps {
  members: WorkspaceMember[];
  isOwner?: boolean;
  currentUserId?: string;
  onRemoveMember?: (member: WorkspaceMember) => Promise<void>;
}

export function MemberList({
  members,
  isOwner = false,
  currentUserId,
  onRemoveMember,
}: MemberListProps) {
  const [targetMember, setTargetMember] = useState<WorkspaceMember | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const confirmRemove = async () => {
    if (!targetMember || !onRemoveMember) return;
    setIsRemoving(true);
    try {
      await onRemoveMember(targetMember);
      setTargetMember(null);
    } catch (err: any) {
      console.error("Failed to remove member", err);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[var(--color-ink)] font-[var(--font-headline)]">
        Workspace Members ({members.length})
      </h2>

      <div className="divide-y divide-[var(--color-border)] rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
        {members.map((m) => {
          const isMe = m.user_id === currentUserId || m.id === currentUserId;
          const isMemberOwner = m.role === "owner";
          const canRemove = isOwner && !isMemberOwner && !isMe;

          return (
            <div key={m.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm"
                    style={{ backgroundColor: m.avatar_color || "var(--color-primary)" }}
                  >
                    {m.name ? m.name[0].toUpperCase() : "U"}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <OnlineDot userId={m.user_id} />
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-[var(--color-ink)] flex items-center gap-2">
                    {m.name}
                    {isMe && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] text-[10px] font-medium">
                        You
                      </span>
                    )}
                    {isMemberOwner ? (
                      <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase">
                        <Crown className="w-2.5 h-2.5" />
                        Owner
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] text-[10px] font-semibold uppercase border border-[var(--color-border)]">
                        Member
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[var(--color-ink-muted)]">{m.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-[var(--color-ink-muted)]">
                  Joined {new Date(m.joined_at).toLocaleDateString()}
                </div>
                {canRemove && (
                  <button
                    onClick={() => setTargetMember(m)}
                    className="p-1.5 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition cursor-pointer text-xs font-semibold flex items-center gap-1"
                    title={`Remove ${m.name} from workspace`}
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Remove Member Confirmation Modal */}
      {targetMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[var(--color-danger)]">
              <UserMinus className="w-5 h-5" />
              <h3 className="font-bold text-lg text-[var(--color-ink)] font-[var(--font-headline)]">
                Remove Member?
              </h3>
            </div>
            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
              Are you sure you want to remove <strong className="text-[var(--color-ink)]">{targetMember.name}</strong> ({targetMember.email}) from this workspace? They will be removed from all channels.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTargetMember(null)}
                disabled={isRemoving}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-surface-2)] text-[var(--color-ink)] hover:bg-[var(--color-border)] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemove}
                disabled={isRemoving}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-danger)] text-white hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer"
              >
                {isRemoving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  "Remove Member"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
