import type { NextRequest } from "next/server";
import { getBookingDetailData } from "./data";

export async function GET(request: NextRequest) {
  const bookingId = request.nextUrl.searchParams.get("bookingId");

  if (!bookingId) {
    return Response.json({ message: "Missing bookingId" }, { status: 400 });
  }

  return Response.json(getBookingDetailData(bookingId));
}
