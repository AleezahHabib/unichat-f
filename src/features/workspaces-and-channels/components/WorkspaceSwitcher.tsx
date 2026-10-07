"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Workspace } from "../api";
import {
  ChevronDown,
  Check,
  Plus,
  Link as LinkIcon,
  Crown,
  LayoutGrid,
} from "lucide-react";

interface WorkspaceSwitcherProps {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  currentUserId?: string;
  onOpenCreateModal: () => void;
  onOpenJoinModal: () => void;
}

export function WorkspaceSwitcher({
  currentWorkspace,
  workspaces,
  currentUserId,
  onOpenCreateModal,
  onOpenJoinModal,
}: WorkspaceSwitcherProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside and escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectWorkspace = (wsId: string) => {
    setIsOpen(false);
    if (wsId !== currentWorkspace?.id) {
      router.push(`/workspace/${wsId}`);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1 min-w-0">
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="w-full flex items-center justify-between gap-2 p-1.5 -ml-1 rounded-xl hover:bg-[var(--color-surface-2)] transition text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      >
        <div className="flex items-center gap-2.5 min-w-0 truncate">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] text-white font-bold flex items-center justify-center text-xs shadow-sm shrink-0">
            {currentWorkspace?.name ? currentWorkspace.name[0].toUpperCase() : "W"}
          </div>
          <span className="font-bold text-sm text-[var(--color-ink)] truncate font-[var(--font-headline)]">
            {currentWorkspace?.name || "Select Workspace"}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[var(--color-ink-muted)] group-hover:text-[var(--color-ink)] transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          className="absolute left-0 top-full mt-2 w-72 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 divide-y divide-[var(--color-border)]"
        >
          {/* Workspaces List Section */}
          <div className="py-1 max-h-60 overflow-y-auto px-1.5 space-y-0.5">
            <div className="px-2 py-1 text-[10px] font-bold text-[var(--color-ink-muted)] uppercase tracking-wider">
              Workspaces ({workspaces.length})
            </div>
            {workspaces.map((ws) => {
              const isCurrent = ws.id === currentWorkspace?.id;
              const isOwner = currentUserId && ws.owner_id === currentUserId;

              return (
                <button
                  key={ws.id}
                  role="menuitem"
                  onClick={() => handleSelectWorkspace(ws.id)}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left transition cursor-pointer text-xs ${
                    isCurrent
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold"
                      : "hover:bg-[var(--color-surface-2)] text-[var(--color-ink)] font-normal"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 truncate">
                    <div
                      className={`w-6 h-6 rounded-md font-bold flex items-center justify-center text-[10px] shrink-0 ${
                        isCurrent
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[var(--color-surface-2)] text-[var(--color-ink)]"
                      }`}
                    >
                      {ws.name[0].toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="truncate font-medium">{ws.name}</span>
                        {isOwner && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[9px] font-bold uppercase shrink-0">
                            <Crown className="w-2.5 h-2.5" />
                            Owner
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[var(--color-ink-muted)] truncate">
                        {ws.member_count != null
                          ? `${ws.member_count} member${ws.member_count !== 1 ? "s" : ""}`
                          : "1 member"}
                      </div>
                    </div>
                  </div>
                  {isCurrent && <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Actions Section */}
          <div className="py-1 px-1.5 space-y-0.5">
            <button
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                onOpenCreateModal();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-primary)] transition cursor-pointer text-left"
            >
              <div className="w-6 h-6 rounded-md bg-[var(--color-surface-2)] flex items-center justify-center text-[var(--color-ink-muted)] shrink-0">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span>Create workspace</span>
            </button>

            <button
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                onOpenJoinModal();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-primary)] transition cursor-pointer text-left"
            >
              <div className="w-6 h-6 rounded-md bg-[var(--color-surface-2)] flex items-center justify-center text-[var(--color-ink-muted)] shrink-0">
                <LinkIcon className="w-3.5 h-3.5" />
              </div>
              <span>Join via invite link</span>
            </button>

            <button
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                router.push("/workspaces");
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] transition cursor-pointer text-left"
            >
              <div className="w-6 h-6 rounded-md bg-[var(--color-surface-2)] flex items-center justify-center text-[var(--color-ink-muted)] shrink-0">
                <LayoutGrid className="w-3.5 h-3.5" />
              </div>
              <span>All workspaces</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
