import { mockTimeSlotData } from "../data";

export async function POST(request: Request) {
  const { shopId, startDate } = await request.json();

  if (!shopId) {
    return Response.json({ message: "Missing id" }, { status: 400 });
  } else if (!startDate) {
    // TODO
  }

  return Response.json(mockTimeSlotData);
}
