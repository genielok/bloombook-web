export async function POST(request: Request) {
  const { promo } = await request.json();
  const curPromo = String(promo).toLowerCase();
  if (curPromo === "petal10" || curPromo === "bloom10") {
    return Response.json({ available: true });
  } else {
    return Response.json({ available: false });
  }
}
