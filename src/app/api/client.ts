import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "../auth/store";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

let refreshing: Promise<void> | null = null;

async function refreshSession() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token");
  }
  const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) {
    clearTokens();
    throw new Error("Refresh failed");
  }
  const data = (await res.json()) as { token: string; refresh_token?: string };
  setTokens(data.token, data.refresh_token);
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAccessToken();
  const isForm = options?.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isForm ? {} : { "Content-Type": "application/json" }),
    ...(options?.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (res.status === 401 && getRefreshToken()) {
    if (!refreshing) {
      refreshing = refreshSession().finally(() => {
        refreshing = null;
      });
    }
    try {
      await refreshing;
      const retryToken = getAccessToken();
      const retryHeaders: Record<string, string> = {
        ...(retryToken ? { Authorization: `Bearer ${retryToken}` } : {}),
        ...(isForm ? {} : { "Content-Type": "application/json" }),
        ...(options?.headers || {}),
      };
      const retryRes = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: retryHeaders,
      });
      if (!retryRes.ok) {
        const retryText = await retryRes.text();
        throw new Error(retryText || `Request failed: ${retryRes.status}`);
      }
      return retryRes.json() as Promise<T>;
    } catch {
      clearTokens();
      throw new Error("Unauthorized");
    }
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  register: (email: string, password: string) =>
    request<{ status: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ token: string; refresh_token: string; user: { email: string } }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    ),
  refresh: () => request<{ token: string; refresh_token?: string }>("/api/auth/refresh", { method: "POST" }),
  logout: (refreshToken?: string | null) =>
    request<{ status: string }>("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),
  passwordReset: (email: string) =>
    request<{ status: string; reset_token?: string }>("/api/auth/password-reset", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  passwordResetConfirm: (token: string, newPassword: string) =>
    request<{ status: string }>("/api/auth/password-reset/confirm", {
      method: "POST",
      body: JSON.stringify({ token, new_password: newPassword }),
    }),
  chat: (message: string) =>
    request<{ reply: string }>("/api/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  summary: (context: string) =>
    request<{ summary: string }>("/api/ai/summary", {
      method: "POST",
      body: JSON.stringify({ context }),
    }),
  diet: (dietType: string, notes?: string) =>
    request<{ plan: string }>("/api/ai/diet", {
      method: "POST",
      body: JSON.stringify({ diet_type: dietType, notes }),
    }),
  translate: (text: string, targetLanguage: string) =>
    request<{ translated: string }>("/api/ai/translate", {
      method: "POST",
      body: JSON.stringify({ text, target_language: targetLanguage }),
    }),
  ocr: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<{ text: string; method?: string }>("/api/ai/ocr", {
      method: "POST",
      body: form,
    });
  },
  saveCbc: (payload: Record<string, unknown>) =>
    request<{ status: string }>("/api/data/cbc", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  saveSymptoms: (payload: Record<string, unknown>) =>
    request<{ status: string }>("/api/data/symptoms", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
