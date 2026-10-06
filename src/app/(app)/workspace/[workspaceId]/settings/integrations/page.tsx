"use client";

import React, { useEffect, useState, use, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getIntegrations,
  getWorkspaceChannelLinks,
  ConnectedPlatform,
  ChannelLink,
} from "@/features/integrations/api";
import { getChannels, Channel } from "@/features/workspaces-and-channels/api";
import { ConnectCard } from "@/features/integrations/components/ConnectCard";
import { ChannelLinksTable } from "@/features/integrations/components/ChannelLinksTable";
import { SetupGuide } from "@/features/integrations/components/SetupGuide";

export default function IntegrationsSettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.workspaceId;
  const searchParams = useSearchParams();
  const router = useRouter();

  const [connectedPlatforms, setConnectedPlatforms] = useState<ConnectedPlatform[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelLinks, setChannelLinks] = useState<ChannelLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const slackParam = searchParams.get("slack");
    const errorParam = searchParams.get("error");

    if (slackParam === "connected") {
      setBanner({
        type: "success",
        message: "Slack workspace connected successfully! You can now link channels below.",
      });
      // Clear URL parameter cleanly
      router.replace(`/workspace/${workspaceId}/settings/integrations`);
    } else if (errorParam) {
      let msg = "An error occurred while connecting the integration.";
      if (errorParam === "csrf_rejected") {
        msg = "OAuth state verification failed (CSRF rejected) or authorization expired. Please try again.";
      } else if (errorParam === "access_denied") {
        msg = "Slack authorization was cancelled or denied.";
      } else if (errorParam === "missing_code") {
        msg = "Authorization code was missing from the callback request.";
      } else {
        msg = `Integration connection failed: ${errorParam}`;
      }
      setBanner({ type: "error", message: msg });
      router.replace(`/workspace/${workspaceId}/settings/integrations`);
    }
  }, [searchParams, router, workspaceId]);

  const loadData = useCallback(async () => {
    try {
      const [platformsList, channelsList, linksList] = await Promise.all([
        getIntegrations(workspaceId),
        getChannels(workspaceId),
        getWorkspaceChannelLinks(workspaceId),
      ]);
      setConnectedPlatforms(platformsList);
      setChannels(channelsList);
      setChannelLinks(linksList);
    } catch (err: any) {
      console.error("Failed to load integrations data", err);
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto space-y-8 bg-bg">
      <div>
        <h1 className="text-2xl font-extrabold text-ink font-headline">
          Platform Integrations
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          Connect Slack and Discord for seamless two-way message synchronization
        </p>
      </div>

      {banner && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
            banner.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-danger"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{banner.type === "success" ? "✓" : "⚠"}</span>
            <span>{banner.message}</span>
          </div>
          <button
            onClick={() => setBanner(null)}
            className="text-ink-muted hover:text-ink px-2 py-0.5 rounded cursor-pointer transition"
          >
            ✕
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <ConnectCard
            workspaceId={workspaceId}
            connectedPlatforms={connectedPlatforms}
            onRefresh={loadData}
          />

          <ChannelLinksTable
            channels={channels}
            links={channelLinks}
            connectedPlatforms={connectedPlatforms}
            onRefresh={loadData}
          />

          <SetupGuide />
        </>
      )}
    </div>
  );
}
