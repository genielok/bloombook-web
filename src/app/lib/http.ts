// src/lib/http.ts

// Production requests stay on the frontend origin and are proxied to the API
// by the rewrite in next.config.ts. NEXT_PUBLIC_API_URL is only for local dev.
export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_URL || ""
    : "";
export const API_ERROR_EVENT = "bloombook:api-error";

type RequestOptions = {
  headers?: HeadersInit;
  credentials?: "include";
  showErrorToast?: boolean;
  redirectOnUnauthorized?: boolean;
};

type ApiErrorEventDetail = {
  message: string;
  status: number;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getErrorMessage(body: unknown, fallback: string) {
  if (!body || typeof body !== "object") return fallback;

  const responseBody = body as { detail?: unknown; message?: unknown };
  if (typeof responseBody.detail === "string") return responseBody.detail;
  if (typeof responseBody.message === "string") return responseBody.message;

  if (Array.isArray(responseBody.detail)) {
    const messages = responseBody.detail
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const validationError = item as { loc?: unknown; msg?: unknown };
        if (typeof validationError.msg !== "string") return null;

        const location = Array.isArray(validationError.loc)
          ? validationError.loc.filter((part) => part !== "body").join(".")
          : "";
        return location
          ? `${location}: ${validationError.msg}`
          : validationError.msg;
      })
      .filter((message): message is string => Boolean(message));

    if (messages.length > 0) return messages.join("; ");
  }

  return fallback;
}

async function createApiError(response: Response) {
  const fallback = response.statusText || "API request failed";
  const body = await response
    .clone()
    .json()
    .catch(async () => {
      const text = await response.text();
      return text ? { detail: text } : null;
    });

  return new ApiError(getErrorMessage(body, fallback), response.status);
}

function notifyApiError(error: ApiError) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<ApiErrorEventDetail>(API_ERROR_EVENT, {
      detail: {
        message: error.message,
        status: error.status,
      },
    }),
  );
}

const authRequestPaths = new Set([
  "/api/admin/user/login",
  "/api/admin/user/register",
  "/api/user/login",
  "/api/user/register",
]);

let isRedirectingToLogin = false;

function redirectToLogin(requestPath: string) {
  if (typeof window === "undefined" || isRedirectingToLogin) return false;
  if (authRequestPaths.has(requestPath)) return false;

  const currentPath = window.location.pathname;
  const isAdminRequest = requestPath.startsWith("/api/admin/");
  const isAdminPage = currentPath.startsWith("/admin");
  const loginPath = isAdminRequest || isAdminPage
    ? "/admin/login"
    : "/client/login";

  if (currentPath === loginPath) return false;

  const callbackUrl = `${currentPath}${window.location.search}`;
  const loginUrl = new URL(loginPath, window.location.origin);
  loginUrl.searchParams.set("callbackUrl", callbackUrl);

  isRedirectingToLogin = true;
  window.location.replace(loginUrl.toString());
  return true;
}

async function handleResponse<T>(
  response: Response,
  requestPath: string,
  showErrorToast: boolean,
  redirectOnUnauthorized: boolean,
) {
  if (!response.ok) {
    const error = await createApiError(response);
    const isRedirecting =
      response.status === 401 &&
      redirectOnUnauthorized &&
      redirectToLogin(requestPath);

    if (showErrorToast && !isRedirecting) notifyApiError(error);
    throw error;
  }

  return response.json() as Promise<T>;
}

async function fetchWithApiError(
  path: string,
  options: RequestInit,
  showErrorToast: boolean,
) {
  try {
    return await fetch(`${API_BASE_URL}${path}`, options);
  } catch (cause) {
    const error = new ApiError(
      cause instanceof Error ? cause.message : "Unable to reach the server",
      0,
    );
    if (showErrorToast) notifyApiError(error);
    throw error;
  }
}

async function request<T>(
  path: string,
  options?: RequestInit,
  showErrorToast = true,
  redirectOnUnauthorized = true,
): Promise<T> {
  const res = await fetchWithApiError(
    path,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    },
    showErrorToast,
  );

  return handleResponse<T>(
    res,
    path,
    showErrorToast,
    redirectOnUnauthorized,
  );
}

export function get<T>(path: string, options?: RequestOptions) {
  return request<T>(
    path,
    {
      method: "GET",
      credentials: options?.credentials ?? "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    },
    options?.showErrorToast ?? true,
    options?.redirectOnUnauthorized ?? true,
  );
}

export function post<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  options?: RequestOptions,
) {
  return request<TResponse>(
    path,
    {
      method: "POST",
      body: JSON.stringify(body),
      credentials: options?.credentials ?? "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    },
    options?.showErrorToast ?? true,
    options?.redirectOnUnauthorized ?? true,
  );
}

// multipart/form-data upload — do not set Content-Type manually, the
// browser needs to add its own boundary for the FormData body.
export async function upload<T>(
  path: string,
  formData: FormData,
  options?: RequestOptions,
): Promise<T> {
  const showErrorToast = options?.showErrorToast ?? true;
  const res = await fetchWithApiError(
    path,
    {
      method: "POST",
      body: formData,
      credentials: options?.credentials ?? "include",
      headers: {
        ...options?.headers,
      },
    },
    showErrorToast,
  );

  return handleResponse<T>(
    res,
    path,
    showErrorToast,
    options?.redirectOnUnauthorized ?? true,
  );
}
