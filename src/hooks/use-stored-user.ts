"use client";

import { useMemo, useSyncExternalStore } from "react";

import type { User } from "@/app/api/clients/types";

const USER_STORAGE_KEY = "user";
const USER_CHANGE_EVENT = "bloombook:user-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(USER_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(USER_CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(USER_STORAGE_KEY) ?? "";
}

function getServerSnapshot() {
  return "";
}

export function useStoredUser() {
  const storedUser = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return useMemo<User | undefined>(() => {
    if (!storedUser) return undefined;

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return undefined;
    }
  }, [storedUser]);
}

export function notifyStoredUserChanged() {
  window.dispatchEvent(new Event(USER_CHANGE_EVENT));
}
