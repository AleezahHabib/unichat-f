import { apiClient } from "@/lib/api-client";
import { components } from "@/types/api";

export type ConnectedPlatform = components["schemas"]["ConnectedPlatformResponse"];
export type ExternalChannel = components["schemas"]["ExternalChannel"];
export type ChannelLink = components["schemas"]["ChannelLinkResponse"];

export async function getIntegrations(workspaceId: string): Promise<ConnectedPlatform[]> {
  return apiClient<ConnectedPlatform[]>(`/integrations?workspace_id=${workspaceId}`);
}

export async function getWorkspaceChannelLinks(workspaceId: string): Promise<ChannelLink[]> {
  return apiClient<ChannelLink[]>(`/workspaces/${workspaceId}/channel-links`);
}

export async function connectSlack(
  workspaceId: string,
  botToken: string,
  appToken: string
): Promise<ConnectedPlatform> {
  return apiClient<ConnectedPlatform>("/integrations/slack/connect", {
    method: "POST",
    body: JSON.stringify({ workspace_id: workspaceId, bot_token: botToken, app_token: appToken }),
  });
}

export async function connectDiscord(
  workspaceId: string,
  botToken: string
): Promise<ConnectedPlatform> {
  return apiClient<ConnectedPlatform>("/integrations/discord/connect", {
    method: "POST",
    body: JSON.stringify({ workspace_id: workspaceId, bot_token: botToken }),
  });
}

export async function deleteIntegration(platformId: string): Promise<void> {
  return apiClient<void>(`/integrations/${platformId}`, {
    method: "DELETE",
  });
}

export async function getExternalChannels(platformId: string): Promise<ExternalChannel[]> {
  return apiClient<ExternalChannel[]>(`/integrations/${platformId}/external-channels`);
}

export async function linkChannel(
  channelId: string,
  platformId: string,
  externalChannelId: string,
  externalChannelName: string
): Promise<ChannelLink> {
  return apiClient<ChannelLink>(`/channels/${channelId}/link`, {
    method: "POST",
    body: JSON.stringify({
      platform_id: platformId,
      external_channel_id: externalChannelId,
      external_channel_name: externalChannelName,
    }),
  });
}

export async function unlinkChannel(channelId: string, platform: string): Promise<void> {
  return apiClient<void>(`/channels/${channelId}/link?platform=${platform}`, {
    method: "DELETE",
  });
}


