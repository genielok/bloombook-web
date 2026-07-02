export async function POST() {
  // const { searchParams } = new URL(request.url);

  // const category = searchParams.get("service_id");
  // const date = searchParams.get("date");

  // if (!serviceId || !date) {
  //   return NextResponse.json(
  //     { message: "Missing service_id or date" },
  //     { status: 400 }
  //   );
  // }
  return Response.json({
    total: 100,
    page: 1,
    dataList: [
      { id: "1", name: "Lumière Hair", category: "Hair", location: "Prenzlauer Berg, Berlin", rating: "4.8", price: "€€", services: ["Cut", "color & styling"], availableToday: true },
      { id: "2", name: "Atelier 9", category: "Brows & Lashes", location: "Charlottenburg, Berlin", rating: "5.0", price: "€€€", services: ["Lash lifts & brow design"], availableToday: false },
      { id: "3", name: "Nordic Spa", category: "Massage", location: "Kreuzberg, Berlin", rating: "4.7", price: "€€", services: ["Deep tissue & relaxation"], availableToday: true },
      { id: "4", name: "Marble & Rose", category: "Beauty", location: "Schöneberg, Berlin", rating: "4.9", price: "€€€", services: ["Facials & skincare"], availableToday: false },
      { id: "5", name: "Studio Linn", category: "Nails", location: "Friedrichshain, Berlin", rating: "4.8", price: "€€", services: ["Acrylics & nail art"], availableToday: true },
    ]
  })
}
