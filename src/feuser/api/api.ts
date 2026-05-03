const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-changed"));
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

async function requestForm<T>(path: string, body: FormData): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body,
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-changed"));
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get:  <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: any) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put:  <T>(path: string, body?: any) => request<T>(path, { method: "PUT",  body: JSON.stringify(body) }),
  del:  <T>(path: string) => request<T>(path, { method: "DELETE" }),
  postForm: <T>(path: string, body: FormData) => requestForm<T>(path, body),
};

export { BASE_URL };
