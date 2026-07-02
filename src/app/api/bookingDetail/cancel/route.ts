import type { NextRequest } from "next/server";

type CancelBookingBody = Partial<{
  bookingId: string;
}>;

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CancelBookingBody;
  const bookingId = body.bookingId?.trim();

  if (!bookingId) {
    return Response.json(
      {
        message: "Missing bookingId",
        ok: false,
      },
      { status: 400 },
    );
  }

  return Response.json({
    message: "Mock booking cancelled",
    ok: true,
  });
}
