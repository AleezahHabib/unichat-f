import { apiClient } from "@/lib/api-client";
import { components } from "@/types/api";

export type User = components["schemas"]["UserResponse"];
export type AuthResponse = components["schemas"]["AuthResponse"];
export type RegisterRequest = components["schemas"]["RegisterRequest"];
export type LoginRequest = components["schemas"]["LoginRequest"];

export async function signup(data: RegisterRequest): Promise<AuthResponse> {
  return apiClient<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  return apiClient<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMe(): Promise<User> {
  return apiClient<User>("/auth/me", {
    method: "GET",
  });
}
