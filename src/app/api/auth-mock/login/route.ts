// src/app/api/mock-auth/login/route.ts

import { mockUser } from "@/lib/mockAuth";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    message: "Mock login success",
    user: mockUser,
    ok: true,
  });

  response.cookies.set("mock_auth", "1", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
