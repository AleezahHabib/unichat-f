"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { useAuth } from "@/features/authentication/useAuth";
import { getChannels, getWorkspaces, Channel, Workspace } from "@/features/workspaces-and-channels/api";
import { getWorkspaceChannelLinks, ChannelLink } from "@/features/integrations/api";
import { ChannelList } from "@/features/workspaces-and-channels/components/ChannelList";
import { CreateChannelModal } from "@/features/workspaces-and-channels/components/CreateChannelModal";
import { BrowseChannelsModal } from "@/features/workspaces-and-channels/components/BrowseChannelsModal";
import { WorkspaceSettingsModal } from "@/features/workspaces-and-channels/components/WorkspaceSettingsModal";
import { RealtimeProvider } from "@/features/realtime/RealtimeProvider";
import { OnlineDot } from "@/features/realtime/components/OnlineDot";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.workspaceId;
  const { user, logout } = useAuth();

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelLinks, setChannelLinks] = useState<ChannelLink[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBrowseModalOpen, setIsBrowseModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const allWs = await getWorkspaces();
      const current = allWs.find((w) => w.id === workspaceId);
      if (current) setWorkspace(current);

      const [chList, linksList] = await Promise.all([
        getChannels(workspaceId),
        getWorkspaceChannelLinks(workspaceId).catch(() => []),
      ]);
      setChannels(chList);
      setChannelLinks(linksList);
    } catch (err: any) {
      console.error("Failed to load workspace layout data", err);
    }
  }, [workspaceId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <RealtimeProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[var(--color-bg)]">
        {/* Sidebar */}
        <aside className="w-64 flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)] shrink-0">
          {/* Workspace Header */}
          <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <Link
              href="/workspaces"
              className="flex items-center gap-2 hover:opacity-80 transition truncate"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                {workspace?.name ? workspace.name[0].toUpperCase() : "W"}
              </div>
              <span className="font-bold text-base text-[var(--color-ink)] truncate font-[var(--font-headline)]">
                {workspace?.name || "Workspace"}
              </span>
            </Link>
            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Workspace Settings, Members & Invites"
              className="p-1.5 rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Channel Navigation */}
          <div className="flex-1 overflow-y-auto p-3">
            <ChannelList
              workspaceId={workspaceId}
              channels={channels}
              channelLinks={channelLinks}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onOpenBrowseModal={() => setIsBrowseModalOpen(true)}
            />
          </div>

          {/* Current User Bar */}
          <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-surface-2)]/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="relative">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                  style={{ backgroundColor: user?.avatar_color || "var(--color-primary)" }}
                >
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5">
                  <OnlineDot isOnline={true} />
                </div>
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-[var(--color-ink)] truncate">
                  {user?.name}
                </div>
                <div className="text-[10px] text-[var(--color-ink-muted)] truncate">
                  {user?.email}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-danger)] transition"
            >
              🚪
            </button>
          </div>
        </aside>

        {/* Main Content View */}
        <main className="flex-1 flex min-w-0">{children}</main>

        {/* Modals */}
        <CreateChannelModal
          workspaceId={workspaceId}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onChannelCreated={(newCh) => setChannels((prev) => [...prev, newCh])}
        />
        <BrowseChannelsModal
          workspaceId={workspaceId}
          isOpen={isBrowseModalOpen}
          channels={channels}
          onClose={() => setIsBrowseModalOpen(false)}
          onJoined={loadData}
        />
        <WorkspaceSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          workspaceId={workspaceId}
          workspaceName={workspace?.name || "Workspace"}
          currentUserId={user?.id}
        />
      </div>
    </RealtimeProvider>
  );
}
