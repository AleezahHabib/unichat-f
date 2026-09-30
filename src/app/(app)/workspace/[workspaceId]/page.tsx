"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getChannels } from "@/features/workspaces-and-channels/api";

export default function WorkspaceIndexPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.workspaceId;
  const router = useRouter();

  useEffect(() => {
    async function redirect() {
      try {
        const channels = await getChannels(workspaceId);
        const general = channels.find((c) => c.name === "general") || channels[0];
        if (general) {
          router.replace(`/workspace/${workspaceId}/channel/${general.id}`);
        }
      } catch (err: any) {
        console.error("Failed to redirect to channel", err);
      }
    }
    redirect();
  }, [workspaceId, router]);

  return (
    <div className="flex-1 flex items-center justify-center bg-[var(--color-bg)]">
      <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
