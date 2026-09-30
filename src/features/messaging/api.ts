import { apiClient } from "@/lib/api-client";
import { components } from "@/types/api";

export type Message = components["schemas"]["MessageResponse"];
export type MessagesPage = components["schemas"]["MessagesPageResponse"];
export type Thread = components["schemas"]["ThreadResponse"];

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

export async function clearChannelMessages(
  channelId: string
): Promise<{ status: string; deleted_count: number }> {
  return apiClient<{ status: string; deleted_count: number }>(
    `/channels/${channelId}/messages`,
    {
      method: "DELETE",
    }
  );
}

export async function getThread(messageId: string): Promise<Thread> {
  return apiClient<Thread>(`/messages/${messageId}/thread`);
}

