"use client";

import React, { useState } from "react";
import { createInvite } from "../api";
import { Copy, Check, ShieldAlert, Link as LinkIcon, Loader2 } from "lucide-react";

interface InviteCardProps {
  workspaceId: string;
  isOwner?: boolean;
}

export function InviteCard({ workspaceId, isOwner = true }: InviteCardProps) {
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!isOwner) {
      setError("Only the workspace owner can generate invite links.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const inv = await createInvite(workspaceId);
      const url = `${window.location.origin}/invite/${inv.token}`;
      setInviteLink(url);
    } catch (err: any) {
      setError(err.message || "Only the workspace owner can generate invite links.");
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

  return (
    <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 shadow-sm relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[var(--color-ink)] font-[var(--font-headline)]">
              Invite Team Members
            </h3>
            {!isOwner && (
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                Owner Only
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--color-ink-muted)] mt-1">
            Generate a 7-day shareable invite link for new teammates to join this workspace
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[var(--color-danger)] text-xs flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {inviteLink ? (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] pointer-events-none" />
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs text-[var(--color-ink)] font-mono focus:outline-none"
            />
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-semibold hover:opacity-90 active:scale-95 transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !isOwner}
          title={!isOwner ? "Only the workspace owner can generate invite links" : "Generate Invite Link"}
          className="px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-semibold hover:opacity-90 active:scale-95 transition shadow disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <span>Generate Invite Link</span>
          )}
        </button>
      )}
    </div>
  );
}

