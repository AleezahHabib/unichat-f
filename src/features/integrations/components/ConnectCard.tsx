"use client";

import React, { useState } from "react";
import { connectSlack, connectDiscord, ConnectedPlatform, deleteIntegration } from "../api";
import { PlatformBadge } from "./PlatformBadge";

interface ConnectCardProps {
  workspaceId: string;
  connectedPlatforms: ConnectedPlatform[];
  onRefresh: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  const [showAdvancedSlack, setShowAdvancedSlack] = useState(false);

  const isSlackConnected = connectedPlatforms.some((p) => p.platform === "slack");
  const isDiscordConnected = connectedPlatforms.some((p) => p.platform === "discord");

  const handleSlackOAuth = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("unichat_token") : null;
    const url = `${API_BASE}/integrations/slack/oauth/start?workspace_id=${workspaceId}${token ? `&token=${token}` : ""}`;
    window.location.href = url;
  };

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
        <h3 className="text-base font-bold text-ink font-headline">
          Connected Platforms
        </h3>

        {connectedPlatforms.length === 0 ? (
          <div className="p-4 rounded-xl bg-surface border border-border text-xs text-ink-muted">
            No platforms connected yet. Connect Slack or Discord below.
          </div>
        ) : (
          <div className="space-y-2">
            {connectedPlatforms.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <PlatformBadge platform={p.platform} />
                  <div>
                    <div className="font-semibold text-sm text-ink">
                      {p.display_name}
                    </div>
                    <div className="text-xs text-ink-muted">
                      Connected {new Date(p.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDisconnect(p.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 text-danger text-xs font-semibold hover:bg-red-500/20 transition cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connect Section */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-ink">Connect Platform</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPlatform("slack")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                platform === "slack"
                  ? "bg-primary text-white"
                  : "bg-surface-2 text-ink-muted hover:text-ink"
              }`}
            >
              Slack {isSlackConnected && "(Active)"}
            </button>
            <button
              type="button"
              onClick={() => setPlatform("discord")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                platform === "discord"
                  ? "bg-primary text-white"
                  : "bg-surface-2 text-ink-muted hover:text-ink"
              }`}
            >
              Discord {isDiscordConnected && "(Active)"}
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-danger font-medium">{error}</p>}

        {/* Slack Connect View */}
        {platform === "slack" && (
          <div className="space-y-5">
            {/* Primary Action: Add to Slack OAuth Button */}
            <div className="p-5 rounded-xl bg-surface-2 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded flex items-center justify-center bg-[#4A154B] text-white text-xs font-bold font-mono">
                    #
                  </div>
                  <h4 className="text-sm font-bold text-ink">Connect Slack Workspace</h4>
                </div>
                <p className="text-xs text-ink-muted">
                  Authorize UniChat in 1-click via official Slack OAuth to enable bidirectional syncing.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSlackOAuth}
                disabled={isSlackConnected}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A154B] hover:bg-[#3B113C] text-white text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer shrink-0"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                </svg>
                {isSlackConnected ? "Slack Connected" : "Add to Slack"}
              </button>
            </div>

            {/* Collapsible Manual Setup */}
            <div className="pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowAdvancedSlack(!showAdvancedSlack)}
                className="text-xs font-semibold text-ink-muted hover:text-ink flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>{showAdvancedSlack ? "▼" : "▶"}</span>
                <span>Advanced: connect your own custom Slack app with tokens</span>
              </button>

              {showAdvancedSlack && (
                <form onSubmit={handleSubmit} className="space-y-4 mt-4 p-4 rounded-xl bg-surface-2 border border-border">
                  <div>
                    <label className="block text-xs font-semibold text-ink-muted uppercase mb-1">
                      Bot User OAuth Token (xoxb-...)
                    </label>
                    <input
                      type="password"
                      required
                      value={botToken}
                      onChange={(e) => setBotToken(e.target.value)}
                      placeholder="xoxb-12345..."
                      className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-muted uppercase mb-1">
                      App-Level Token (xapp-...)
                    </label>
                    <input
                      type="password"
                      required
                      value={appToken}
                      onChange={(e) => setAppToken(e.target.value)}
                      placeholder="xapp-12345..."
                      className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !botToken.trim()}
                    className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 transition shadow disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Connecting..." : "Connect Custom Slack App"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Discord Connect View */}
        {platform === "discord" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase mb-1">
                Discord Bot Token
              </label>
              <input
                type="password"
                required
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="MTIzNDU2N..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-2 border border-border text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              />
              <p className="text-[11px] text-ink-muted mt-1">
                Provide your Discord Bot Token with Message Content Intent enabled.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !botToken.trim()}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 transition shadow disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Connecting..." : "Connect Discord"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
