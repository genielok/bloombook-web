// src/app/api/mock-auth/logout/route.ts

import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    message: "Mock logout success",
  });

  response.cookies.set("mock_auth", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return response;
}
