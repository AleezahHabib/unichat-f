"use client";

import React, { useEffect, useState, use, useCallback } from "react";
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

  const [connectedPlatforms, setConnectedPlatforms] = useState<ConnectedPlatform[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelLinks, setChannelLinks] = useState<ChannelLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto space-y-8 bg-[var(--color-bg)]">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--color-ink)] font-[var(--font-headline)]">
          Platform Integrations
        </h1>
        <p className="text-sm text-[var(--color-ink-muted)] mt-1">
          Connect Slack and Discord for seamless two-way message synchronization
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
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
