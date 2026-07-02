// src/lib/http.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

type RequestOptions = {
    headers?: HeadersInit;
};

async function request<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
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
        method: "GET",
        headers: options?.headers,
    });
}

export function post<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options?: RequestOptions
) {
    return request<TResponse>(path, {
        method: "POST",
        body: JSON.stringify(body),
        headers: options?.headers,
    });
}