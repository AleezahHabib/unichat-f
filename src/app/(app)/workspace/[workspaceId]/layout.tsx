"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import { Settings, Menu, X, Sparkles, Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/features/authentication/useAuth";
import { getChannels, getWorkspaces, Channel, Workspace } from "@/features/workspaces-and-channels/api";
import { getWorkspaceChannelLinks, ChannelLink } from "@/features/integrations/api";
import { ChannelList } from "@/features/workspaces-and-channels/components/ChannelList";
import { WorkspaceSwitcher } from "@/features/workspaces-and-channels/components/WorkspaceSwitcher";
import { CreateWorkspaceModal } from "@/features/workspaces-and-channels/components/CreateWorkspaceModal";
import { JoinWorkspaceModal } from "@/features/workspaces-and-channels/components/JoinWorkspaceModal";
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
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [joinedChannels, setJoinedChannels] = useState<Channel[]>([]);
  const [allChannels, setAllChannels] = useState<Channel[]>([]);
  const [channelLinks, setChannelLinks] = useState<ChannelLink[]>([]);

  // Modals
  const [isCreateWsModalOpen, setIsCreateWsModalOpen] = useState(false);
  const [isJoinWsModalOpen, setIsJoinWsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBrowseModalOpen, setIsBrowseModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Mobile drawer
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const allWs = await getWorkspaces();
      setWorkspaces(allWs);
      const current = allWs.find((w) => w.id === workspaceId);
      if (current) setWorkspace(current);

      const [joinedList, allList, linksList] = await Promise.all([
        getChannels(workspaceId, { joined_only: true }),
        getChannels(workspaceId),
        getWorkspaceChannelLinks(workspaceId).catch(() => []),
      ]);
      setJoinedChannels(joinedList);
      setAllChannels(allList);
      setChannelLinks(linksList);
    } catch (err: any) {
      console.error("Failed to load workspace layout data", err);
    }
  }, [workspaceId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChannelCreated = (newCh: Channel) => {
    setJoinedChannels((prev) => [...prev, newCh]);
    setAllChannels((prev) => [...prev, newCh]);
  };

  return (
    <RealtimeProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[var(--color-bg)] relative">
        {/* Mobile Backdrop */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Sidebar (Desktop fixed width + Mobile slide-over) */}
        <aside
          className={`fixed md:relative inset-y-0 left-0 z-50 w-64 flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)] shrink-0 transition-transform duration-200 ease-in-out ${
            isMobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
          }`}
        >
          {/* Workspace Switcher Header */}
          <div className="p-3.5 border-b border-[var(--color-border)] flex items-center justify-between gap-2">
            <WorkspaceSwitcher
              currentWorkspace={workspace}
              workspaces={workspaces}
              currentUserId={user?.id}
              onOpenCreateModal={() => setIsCreateWsModalOpen(true)}
              onOpenJoinModal={() => setIsJoinWsModalOpen(true)}
            />
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsSettingsOpen(true)}
                title="Workspace Settings, Members & Invites"
                className="p-1.5 rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                title="Close Sidebar"
                className="p-1.5 rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition md:hidden cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Assistant & Global Search Quicklinks */}
          <div className="px-3 pt-3 pb-1 space-y-0.5 border-b border-[var(--color-border)]/50">
            <Link
              href={`/workspace/${workspaceId}/assistant`}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>AI Assistant</span>
            </Link>
            <Link
              href={`/workspace/${workspaceId}/search`}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] transition"
            >
              <SearchIcon className="w-3.5 h-3.5 text-[var(--color-ink-muted)]" />
              <span>Search messages</span>
            </Link>
          </div>

          {/* Channel Navigation (Joined channels only) */}
          <div className="flex-1 overflow-y-auto p-3">
            <ChannelList
              workspaceId={workspaceId}
              channels={joinedChannels}
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
              className="p-1.5 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-danger)] transition cursor-pointer"
            >
              🚪
            </button>
          </div>
        </aside>

        {/* Main Content View with Mobile Header Trigger */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Mobile Top Navbar with Hamburger */}
          <div className="md:hidden flex items-center justify-between px-4 py-2.5 bg-[var(--color-surface)] border-b border-[var(--color-border)] shrink-0">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-ink)] hover:opacity-80 transition flex items-center gap-2 cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
              <span className="text-xs font-semibold font-[var(--font-headline)] truncate max-w-[150px]">
                {workspace?.name || "FistaChat"}
              </span>
            </button>
            <div className="flex items-center gap-1">
              <Link
                href={`/workspace/${workspaceId}/assistant`}
                className="p-1.5 rounded-lg text-[var(--color-primary)] hover:bg-[var(--color-surface-2)]"
                title="AI Assistant"
              >
                <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="flex-1 flex min-w-0 h-full overflow-hidden">{children}</div>
        </main>

        {/* Modals */}
        <CreateWorkspaceModal
          isOpen={isCreateWsModalOpen}
          onClose={() => setIsCreateWsModalOpen(false)}
          onWorkspaceCreated={(newWs) => setWorkspaces((prev) => [...prev, newWs])}
        />
        <JoinWorkspaceModal
          isOpen={isJoinWsModalOpen}
          onClose={() => setIsJoinWsModalOpen(false)}
        />
        <CreateChannelModal
          workspaceId={workspaceId}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onChannelCreated={handleChannelCreated}
        />
        <BrowseChannelsModal
          workspaceId={workspaceId}
          isOpen={isBrowseModalOpen}
          channels={allChannels}
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
