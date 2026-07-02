import type { NextRequest } from "next/server";

import { getShopDetail } from "./data";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return Response.json({ message: "Missing id" }, { status: 400 });
  }

  // In a real application, you would fetch the shop detail from a database or an external API using the provided ID.
  return Response.json(getShopDetail(id));
}
