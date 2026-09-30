"use client";

import React, { useState } from "react";

export function SetupGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs text-[var(--color-ink-muted)] space-y-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between font-bold text-sm text-[var(--color-ink)]"
      >
        <span>📖 Platform Integration Setup Guide (Manual Steps)</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="space-y-4 pt-2 border-t border-[var(--color-border)] leading-relaxed">
          {/* Slack Setup */}
          <div className="space-y-1">
            <h4 className="font-bold text-[var(--color-ink)] flex items-center gap-1">
              <span>Slack Socket Mode Setup</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>Go to <strong>api.slack.com/apps</strong> → &quot;From an app manifest&quot;.</li>
              <li>Set bot scopes: <code className="bg-[var(--color-surface)] px-1 rounded">channels:history, channels:read, channels:join, chat:write, chat:write.customize, users:read</code>.</li>
              <li>Subscribe to bot events: <code className="bg-[var(--color-surface)] px-1 rounded">message.channels</code>.</li>
              <li>Enable <strong>Socket Mode</strong> under Settings.</li>
              <li>Generate an App-Level Token with scope <code className="bg-[var(--color-surface)] px-1 rounded">connections:write</code> (starts with <code className="font-mono">xapp-...</code>).</li>
              <li>Install app to workspace and copy Bot Token (starts with <code className="font-mono">xoxb-...</code>).</li>
            </ol>
          </div>

          {/* Discord Setup */}
          <div className="space-y-1">
            <h4 className="font-bold text-[var(--color-ink)] flex items-center gap-1">
              <span>Discord Bot Setup</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>Go to <strong>discord.com/developers</strong> → New Application → Bot.</li>
              <li>Enable <strong>Message Content Intent</strong> (Mandatory).</li>
              <li>Copy Bot Token.</li>
              <li>Under OAuth2 URL Generator: select scope <code className="bg-[var(--color-surface)] px-1 rounded">bot</code> and permissions <code className="bg-[var(--color-surface)] px-1 rounded">View Channels + Send Messages + Read Message History + Manage Webhooks</code>.</li>
              <li>Open the generated URL to add the bot to your Discord server.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
