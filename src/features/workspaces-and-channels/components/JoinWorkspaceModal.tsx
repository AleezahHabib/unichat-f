"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Link as LinkIcon, ArrowRight, UserPlus } from "lucide-react";

interface JoinWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinWorkspaceModal({ isOpen, onClose }: JoinWorkspaceModalProps) {
  const router = useRouter();
  const [inviteInput, setInviteInput] = useState("");
  const [error, setError] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let token = inviteInput.trim();
    if (token.includes("/invite/")) {
      const parts = token.split("/invite/");
      token = parts[parts.length - 1].split("?")[0].split("#")[0];
    }

    if (!token) {
      setError("Please enter a valid invite link or token");
      return;
    }

    onClose();
    router.push(`/invite/${token}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join via Invite Link">
      <form onSubmit={handleJoin} className="space-y-4">
        <p className="text-xs text-[var(--color-ink-muted)]">
          Paste an invite link or invite token from a teammate to join their workspace.
        </p>

        {error && (
          <div className="p-3 text-xs text-[var(--color-danger)] bg-red-500/10 border border-red-500/20 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[var(--color-ink)]">
            Invite Link or Token
          </label>
          <div className="relative">
            <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] pointer-events-none" />
            <Input
              value={inviteInput}
              onChange={(e) => setInviteInput(e.target.value)}
              placeholder="https://unichat.app/invite/... or token"
              className="pl-9"
              required
              autoFocus
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!inviteInput.trim()}
            className="flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Join Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </form>
    </Modal>
  );
}
