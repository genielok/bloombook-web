import type { User } from "@/types/user";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type RegisterBody = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}>;

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RegisterBody;
  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";

  if (
    !firstName ||
    !lastName ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < 8
  ) {
    return NextResponse.json(
      {
        message: "Invalid account details",
        ok: false,
      },
      { status: 400 },
    );
  }

  const user: User = {
    id: `user_${Date.now()}`,
    name: `${firstName} ${lastName}`,
    email,
    role: "client",
    avatarUrl: "https://github.com/shadcn.png",
  };

  const response = NextResponse.json({
    message: "Mock account created",
    user,
    ok: true,
  });

  response.cookies.set("mock_auth", "1", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
