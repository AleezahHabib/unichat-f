"use client";

import React, { useEffect, useState } from "react";
import { getWorkspaces, Workspace } from "@/features/workspaces-and-channels/api";
import { WorkspacePicker } from "@/features/workspaces-and-channels/components/WorkspacePicker";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await getWorkspaces();
        setWorkspaces(list);
      } catch (err: any) {
        console.error("Failed to load workspaces", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4 bg-[var(--color-bg)]">
      <WorkspacePicker
        workspaces={workspaces}
        onWorkspaceCreated={(ws) => setWorkspaces((prev) => [...prev, ws])}
      />
    </main>
  );
}
