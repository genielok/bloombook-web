import { API_BASE_URL } from "@/app/lib/http";
import * as z from "zod";

export function getAssetUrl(path?: string) {
  if (!path) return undefined;
  if (/^(https?:|blob:|data:)/.test(path)) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
}

type ValidationIssue = {
  loc?: Array<string | number>;
  msg?: string;
  ctx?: { reason?: string };
};

type ApiErrorPayload = {
  detail?: string | ValidationIssue[];
  message?: string;
};

function parseErrorPayload(error: unknown): ApiErrorPayload | string | null {
  const value = error instanceof Error ? error.message : error;

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as ApiErrorPayload;
    } catch {
      return value;
    }
  }

  if (typeof value === "object" && value !== null) {
    return value as ApiErrorPayload;
  }

  return null;
}

function getIssueMessage(issue: ValidationIssue) {
  return issue.ctx?.reason ?? issue.msg ?? "Invalid value.";
}

export const getErrorMessage = (error: unknown) => {
  const payload = parseErrorPayload(error);

  if (!payload) return "Something went wrong.";
  if (typeof payload === "string") return payload;
  if (typeof payload.detail === "string") return payload.detail;
  if (Array.isArray(payload.detail)) {
    return payload.detail.map(getIssueMessage).join(" ");
  }

  return payload.message ?? "Something went wrong.";
};

export function getApiFieldErrors(error: unknown) {
  const payload = parseErrorPayload(error);
  const fieldErrors: Record<string, string> = {};

  if (
    typeof payload !== "object" ||
    payload === null ||
    !Array.isArray(payload.detail)
  ) {
    return fieldErrors;
  }

  for (const issue of payload.detail) {
    const field = issue.loc?.at(-1);
    if (typeof field === "string" && !fieldErrors[field]) {
      fieldErrors[field] = getIssueMessage(issue);
    }
  }

  return fieldErrors;
}

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters long." })
    .trim(),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { error: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
    .regex(/[0-9]/, { error: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Contain at least one special character.",
    })
    .trim(),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
