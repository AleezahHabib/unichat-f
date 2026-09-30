"use client";

import React from "react";
import { WorkspaceMember } from "../api";
import { OnlineDot } from "@/features/realtime/components/OnlineDot";

interface MemberListProps {
  members: WorkspaceMember[];
}

export function MemberList({ members }: MemberListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[var(--color-ink)] font-[var(--font-headline)]">
        Workspace Members ({members.length})
      </h2>

      <div className="divide-y divide-[var(--color-border)] rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
        {members.map((m) => (
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
                  {m.role === "owner" && (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold uppercase">
                      Owner
                    </span>
                  )}
                </div>
                <div className="text-xs text-[var(--color-ink-muted)]">{m.email}</div>
              </div>
            </div>
            <div className="text-xs text-[var(--color-ink-muted)]">
              Joined {new Date(m.joined_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
