"use client";

import React, { useState } from "react";
import { connectSlack, connectDiscord, ConnectedPlatform, deleteIntegration } from "../api";
import { PlatformBadge } from "./PlatformBadge";

interface ConnectCardProps {
  workspaceId: string;
  connectedPlatforms: ConnectedPlatform[];
  onRefresh: () => void;
}

export function ConnectCard({
  workspaceId,
  connectedPlatforms,
  onRefresh,
}: ConnectCardProps) {
  const [platform, setPlatform] = useState<"slack" | "discord">("slack");
  const [botToken, setBotToken] = useState("");
  const [appToken, setAppToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSlackConnected = connectedPlatforms.some((p) => p.platform === "slack");
  const isDiscordConnected = connectedPlatforms.some((p) => p.platform === "discord");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (platform === "slack") {
        await connectSlack(workspaceId, botToken.trim(), appToken.trim());
      } else {
        await connectDiscord(workspaceId, botToken.trim());
      }
      setBotToken("");
      setAppToken("");
      onRefresh();
    } catch (err: any) {
      setError(err.message || "Failed to connect platform");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisconnect = async (id: string) => {
    if (confirm("Are you sure you want to disconnect this integration? Links will be removed.")) {
      try {
        await deleteIntegration(id);
        onRefresh();
      } catch (err: any) {
        console.error("Failed to delete integration", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* List of active integrations */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[var(--color-ink)] font-[var(--font-headline)]">
          Connected Platforms
        </h3>

        {connectedPlatforms.length === 0 ? (
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-ink-muted)]">
            No platforms connected yet. Connect Slack or Discord below.
          </div>
        ) : (
          <div className="space-y-2">
            {connectedPlatforms.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <PlatformBadge platform={p.platform} />
                  <div>
                    <div className="font-semibold text-sm text-[var(--color-ink)]">
                      {p.display_name}
                    </div>
                    <div className="text-xs text-[var(--color-ink-muted)]">
                      Connected {new Date(p.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDisconnect(p.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 text-[var(--color-danger)] text-xs font-semibold hover:bg-red-500/20 transition"
                >
                  Disconnect
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connect Form */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-[var(--color-ink)]">Connect New Platform</h3>

        <div className="flex gap-2 border-b border-[var(--color-border)] pb-3">
          <button
            type="button"
            onClick={() => setPlatform("slack")}
            disabled={isSlackConnected}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              platform === "slack"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            } disabled:opacity-40`}
          >
            Slack {isSlackConnected && "(Connected)"}
          </button>
          <button
            type="button"
            onClick={() => setPlatform("discord")}
            disabled={isDiscordConnected}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              platform === "discord"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            } disabled:opacity-40`}
          >
            Discord {isDiscordConnected && "(Connected)"}
          </button>
        </div>

        {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-ink-muted)] uppercase mb-1">
              {platform === "slack" ? "Bot User OAuth Token (xoxb-...)" : "Bot Token"}
            </label>
            <input
              type="password"
              required
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder={platform === "slack" ? "xoxb-12345..." : "MTIzNDU2N..."}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-mono"
            />
          </div>

          {platform === "slack" && (
            <div>
              <label className="block text-xs font-semibold text-[var(--color-ink-muted)] uppercase mb-1">
                App-Level Token (xapp-...)
              </label>
              <input
                type="password"
                required
                value={appToken}
                onChange={(e) => setAppToken(e.target.value)}
                placeholder="xapp-12345..."
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-mono"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !botToken.trim()}
            className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-semibold hover:opacity-90 transition shadow disabled:opacity-50"
          >
            {isSubmitting ? "Connecting..." : `Connect ${platform === "slack" ? "Slack" : "Discord"}`}
          </button>
        </form>
      </div>
    </div>
  );
}
