import { apiClient } from "@/lib/api-client";
import { components } from "@/types/api";

export type Workspace = components["schemas"]["WorkspaceResponse"];
export type WorkspaceMember = components["schemas"]["WorkspaceMemberResponse"];
export type Channel = components["schemas"]["ChannelResponse"];
export type ChannelMember = components["schemas"]["ChannelMemberResponse"];
export type CreateInviteResponse = components["schemas"]["CreateInviteResponse"];
export type InvitePreviewResponse = components["schemas"]["InvitePreviewResponse"];

export async function getWorkspaces(): Promise<Workspace[]> {
  return apiClient<Workspace[]>("/workspaces");
}

export async function createWorkspace(name: string): Promise<Workspace> {
  return apiClient<Workspace>("/workspaces", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  return apiClient<WorkspaceMember[]>(`/workspaces/${workspaceId}/members`);
}

export async function createInvite(workspaceId: string): Promise<CreateInviteResponse> {
  return apiClient<CreateInviteResponse>(`/workspaces/${workspaceId}/invites`, {
    method: "POST",
  });
}

export async function getInvitePreview(token: string): Promise<InvitePreviewResponse> {
  return apiClient<InvitePreviewResponse>(`/invites/${token}`);
}

export async function acceptInvite(token: string): Promise<{ workspace_id: string }> {
  return apiClient<{ workspace_id: string }>(`/invites/${token}/accept`, {
    method: "POST",
  });
}

export async function leaveWorkspace(workspaceId: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/workspaces/${workspaceId}/leave`, {
    method: "POST",
  });
}

export async function removeWorkspaceMember(
  workspaceId: string,
  userId: string
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/workspaces/${workspaceId}/members/${userId}`, {
    method: "DELETE",
  });
}

export async function getChannels(workspaceId: string): Promise<Channel[]> {
  return apiClient<Channel[]>(`/workspaces/${workspaceId}/channels`);
}

export async function createChannel(
  workspaceId: string,
  name: string,
  description?: string
): Promise<Channel> {
  return apiClient<Channel>(`/workspaces/${workspaceId}/channels`, {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
}

export async function joinChannel(channelId: string): Promise<void> {
  return apiClient<void>(`/channels/${channelId}/join`, {
    method: "POST",
  });
}

export async function leaveChannel(channelId: string): Promise<void> {
  return apiClient<void>(`/channels/${channelId}/leave`, {
    method: "POST",
  });
}

export async function deleteWorkspace(workspaceId: string): Promise<void> {
  return apiClient<void>(`/workspaces/${workspaceId}`, {
    method: "DELETE",
  });
}

export async function getChannelMembers(channelId: string): Promise<ChannelMember[]> {
  return apiClient<ChannelMember[]>(`/channels/${channelId}/members`);
}
