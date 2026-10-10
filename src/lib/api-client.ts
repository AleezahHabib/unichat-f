export class ApiError extends Error {
  public code: string;
  public status: number;
  public retryAfter?: number;

  constructor(message: string, code: string = "INTERNAL_ERROR", status: number = 400, retryAfter?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("unichat_token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (netErr: any) {
    throw new ApiError(
      netErr?.message === "Failed to fetch"
        ? `Unable to connect to backend server at ${API_BASE}. Please verify the backend is running.`
        : netErr?.message || "Network error occurred",
      "NETWORK_ERROR",
      0
    );
  }

  if (!response.ok) {
    let detail = "An error occurred";
    let code = "UNKNOWN_ERROR";
    let retryAfter: number | undefined = undefined;
    try {
      const errJson = await response.json();
      if (Array.isArray(errJson.detail)) {
        // FastAPI 422 Validation Error
        detail = errJson.detail.map((item: any) => item.msg || item.detail || "Invalid input").join("; ");
        code = "VALIDATION_ERROR";
      } else if (typeof errJson.detail === "string") {
        detail = errJson.detail;
        code = errJson.code || code;
      }
      if (typeof errJson.retry_after_seconds === "number") {
        retryAfter = errJson.retry_after_seconds;
      } else if (detail.includes("Try again in ")) {
        const match = detail.match(/Try again in (\d+) seconds/);
        if (match) retryAfter = parseInt(match[1], 10);
      }
    } catch {
      detail = response.statusText || detail;
    }
    throw new ApiError(detail, code, response.status, retryAfter);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

