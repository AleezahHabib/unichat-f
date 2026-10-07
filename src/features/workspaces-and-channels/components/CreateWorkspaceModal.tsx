"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createWorkspace, Workspace } from "../api";
import { Plus, Loader2 } from "lucide-react";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkspaceCreated?: (ws: Workspace) => void;
}

export function CreateWorkspaceModal({
  isOpen,
  onClose,
  onWorkspaceCreated,
}: CreateWorkspaceModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const newWs = await createWorkspace(name.trim());
      setName("");
      if (onWorkspaceCreated) {
        onWorkspaceCreated(newWs);
      }
      onClose();
      router.push(`/workspace/${newWs.id}`);
    } catch (err: any) {
      setError(err?.message || "Failed to create workspace");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Workspace">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-[var(--color-ink-muted)]">
          Workspaces are shared spaces where your team communicates across channels.
        </p>

        {error && (
          <div className="p-3 text-xs text-[var(--color-danger)] bg-red-500/10 border border-red-500/20 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[var(--color-ink)]">
            Workspace Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme Engineering or Launch Team"
            required
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!name.trim() || isSubmitting}
            className="flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Create Workspace</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
