"use client";

import React, { useEffect, useState } from "react";
import { ConnectedPlatform, ExternalChannel, getExternalChannels, linkChannel, ChannelLink } from "../api";

interface LinkChannelModalProps {
  channelId: string;
  isOpen: boolean;
  connectedPlatforms: ConnectedPlatform[];
  onClose: () => void;
  onLinked: (link: ChannelLink) => void;
}

export function LinkChannelModal({
  channelId,
  isOpen,
  connectedPlatforms,
  onClose,
  onLinked,
}: LinkChannelModalProps) {
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>("");
  const [externalChannels, setExternalChannels] = useState<ExternalChannel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string>("");
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connectedPlatforms.length > 0 && !selectedPlatformId) {
      setSelectedPlatformId(connectedPlatforms[0].id);
    }
  }, [connectedPlatforms, selectedPlatformId]);

  useEffect(() => {
    async function loadExtChannels() {
      if (!selectedPlatformId) return;
      setIsLoadingChannels(true);
      setError(null);
      try {
        const list = await getExternalChannels(selectedPlatformId);
        setExternalChannels(list);
        if (list.length > 0) setSelectedChannelId(list[0].id);
      } catch (err: any) {
        setError("Failed to load external channels for this platform");
      } finally {
        setIsLoadingChannels(false);
      }
    }
    loadExtChannels();
  }, [selectedPlatformId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlatformId || !selectedChannelId) return;

    const chosenExtCh = externalChannels.find((c) => c.id === selectedChannelId);
    if (!chosenExtCh) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const link = await linkChannel(
        channelId,
        selectedPlatformId,
        chosenExtCh.id,
        chosenExtCh.name
      );
      onLinked(link);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to link channel");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--color-ink)] font-[var(--font-headline)]">
            Link to External Channel
          </h2>
          <button onClick={onClose} className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">
            ✕
          </button>
        </div>

        {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-ink-muted)] uppercase mb-1">
              Select Connected Platform
            </label>
            <select
              value={selectedPlatformId}
              onChange={(e) => setSelectedPlatformId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs text-[var(--color-ink)]"
            >
              {connectedPlatforms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.display_name} ({p.platform})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-ink-muted)] uppercase mb-1">
              Select External Channel
            </label>
            {isLoadingChannels ? (
              <div className="text-xs text-[var(--color-ink-muted)]">Loading external channels...</div>
            ) : (
              <select
                value={selectedChannelId}
                onChange={(e) => setSelectedChannelId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs text-[var(--color-ink)]"
              >
                {externalChannels.map((c) => (
                  <option key={c.id} value={c.id}>
                    #{c.name} {c.group_name ? `(${c.group_name})` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[var(--color-surface-2)] text-xs font-medium text-[var(--color-ink)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedChannelId}
              className="px-5 py-2 rounded-xl bg-[var(--color-primary)] text-xs font-semibold text-white shadow disabled:opacity-50"
            >
              {isSubmitting ? "Linking..." : "Link Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
