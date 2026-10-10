import { apiClient } from "@/lib/api-client";

export interface Citation {
  message_id: string;
  channel_id?: string;
  author_name: string;
  channel_name: string;
  created_at: string;
  snippet: string;
  source: string;
}

export interface AssistantChatResponse {
  id: string;
  session_id: string;
  role: string;
  content: string;
  citations: Citation[];
  created_at: string;
}

export interface SummarizeResponse {
  summary: string;
  key_points: string[];
  decisions: string[];
  open_questions: string[];
  key_decisions: string[];
  action_items: string[];
  citations: Citation[];
  message_count: number;
}

export interface DraftReplyResponse {
  draft: string;
}

export interface SearchResult {
  message_id: string;
  channel_id: string;
  channel_name: string;
  author_name: string;
  body: string;
  created_at: string;
  score: number;
  is_semantic: boolean;
  source: string;
}

export async function searchMessages(
  workspaceId: string,
  query: string,
  limit: number = 20
): Promise<SearchResult[]> {
  const params = new URLSearchParams({
    workspace_id: workspaceId,
    q: query,
    limit: limit.toString(),
  });
  return apiClient<SearchResult[]>(`/search?${params.toString()}`);
}

export async function chatWithAssistant(
  workspaceId: string,
  sessionId: string,
  message: string
): Promise<AssistantChatResponse> {
  return apiClient<AssistantChatResponse>("/assistant/chat", {
    method: "POST",
    body: JSON.stringify({
      workspace_id: workspaceId,
      session_id: sessionId,
      message,
    }),
  });
}

export async function getAssistantHistory(
  workspaceId: string,
  sessionId: string
): Promise<AssistantChatResponse[]> {
  const params = new URLSearchParams({
    workspace_id: workspaceId,
    session_id: sessionId,
  });
  return apiClient<AssistantChatResponse[]>(`/assistant/history?${params.toString()}`);
}

export async function summarizeChannel(
  channelId: string,
  sinceHours: number = 24
): Promise<SummarizeResponse> {
  return apiClient<SummarizeResponse>("/assistant/summarize", {
    method: "POST",
    body: JSON.stringify({
      channel_id: channelId,
      since_hours: sinceHours,
    }),
  });
}

export async function draftReply(messageId: string): Promise<DraftReplyResponse> {
  return apiClient<DraftReplyResponse>("/assistant/draft-reply", {
    method: "POST",
    body: JSON.stringify({
      message_id: messageId,
    }),
  });
}
