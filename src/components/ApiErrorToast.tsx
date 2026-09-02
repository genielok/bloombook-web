"use client";

import { useEffect, useState } from "react";

import { API_ERROR_EVENT } from "@/app/lib/http";
import Toast from "@/components/Toast";

type ApiErrorEventDetail = {
  message: string;
  status: number;
};

type VisibleError = ApiErrorEventDetail & {
  id: number;
};

export function ApiErrorToast() {
  const [error, setError] = useState<VisibleError | null>(null);

  useEffect(() => {
    const handleApiError = (event: Event) => {
      const { detail } = event as CustomEvent<ApiErrorEventDetail>;
      setError({ ...detail, id: Date.now() });
    };

    window.addEventListener(API_ERROR_EVENT, handleApiError);
    return () => window.removeEventListener(API_ERROR_EVENT, handleApiError);
  }, []);

  return (
    <Toast
      key={error?.id}
      visible={error !== null}
      type="error"
      message="Request failed"
      description={error?.message}
      duration={5000}
      onClose={() => setError(null)}
    />
  );
}
