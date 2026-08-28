// src/lib/http.ts

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

type RequestOptions = {
  headers?: HeadersInit;
  credentials?: "include";
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API request failed");
  }

  return res.json();
}

export function get<T>(path: string, options?: RequestOptions) {
  return request<T>(path, {
    ...options,
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
}

export function post<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  options?: RequestOptions,
) {
  return request<TResponse>(path, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
}

// multipart/form-data upload — do not set Content-Type manually, the
// browser needs to add its own boundary for the FormData body.
export async function upload<T>(
  path: string,
  formData: FormData,
  options?: RequestOptions,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API request failed");
  }

  return res.json();
}
