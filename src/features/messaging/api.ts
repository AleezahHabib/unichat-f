import { apiClient } from "@/lib/api-client";
import { components } from "@/types/api";

export type Message = components["schemas"]["MessageResponse"];
export type MessagesPage = components["schemas"]["MessagesPageResponse"];
export type Thread = components["schemas"]["ThreadResponse"];
export type ClearChannelResponse = components["schemas"]["ClearChannelResponse"];

export async function getChannelMessages(
  channelId: string,
  cursor?: string,
  limit: number = 50
): Promise<MessagesPage> {
  const query = new URLSearchParams();
  if (cursor) query.set("cursor", cursor);
  if (limit) query.set("limit", limit.toString());

  return apiClient<MessagesPage>(`/channels/${channelId}/messages?${query.toString()}`);
}

export async function createMessage(
  channelId: string,
  body: string,
  parentId?: string
): Promise<Message> {
  return apiClient<Message>(`/channels/${channelId}/messages`, {
    method: "POST",
    body: JSON.stringify({ body, parent_id: parentId }),
  });
}

export async function updateMessage(messageId: string, body: string): Promise<Message> {
  return apiClient<Message>(`/messages/${messageId}`, {
    method: "PATCH",
    body: JSON.stringify({ body }),
  });
}

export async function deleteMessage(messageId: string): Promise<Message> {
  return apiClient<Message>(`/messages/${messageId}`, {
    method: "DELETE",
  });
}

export async function clearChannelForMe(
  channelId: string
): Promise<ClearChannelResponse> {
  return apiClient<ClearChannelResponse>(`/channels/${channelId}/clear`, {
    method: "POST",
  });
}

export async function getThread(messageId: string): Promise<Thread> {
  return apiClient<Thread>(`/messages/${messageId}/thread`);
}
