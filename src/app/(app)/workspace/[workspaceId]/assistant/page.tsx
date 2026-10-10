"use client";

import React, { use } from "react";
import { AssistantChat } from "@/features/ai-assistant/components/AssistantChat";

export default function AssistantPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = use(params);
  const { workspaceId } = resolvedParams;

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      <AssistantChat workspaceId={workspaceId} />
    </div>
  );
}
