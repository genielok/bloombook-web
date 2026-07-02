// src/lib/mockAuth.ts
import "server-only";

import type { User } from "@/types/user";
import { cookies } from "next/headers";

export const mockUser: User = {
  id: "user_1",
  name: "Demo User",
  email: "demo@example.com",
  role: "client",
  avatarUrl: "https://github.com/shadcn.png",
};

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("mock_auth")?.value === "1";

  if (!isLoggedIn) {
    return undefined;
  }

  return mockUser;
}
