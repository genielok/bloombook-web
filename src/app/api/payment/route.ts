export async function POST(request: Request) {
  const body = await request.json();

  const {
    selectedDate,
    selectedTime,
    selectedTechnician,
    selectedServiceIds,
    customerDetails,
    amount,
  } = body;

  if (!selectedServiceIds) {
    return Response.json({
      status: 0,
      message: "Mock payment failed",
    });
  }

  return Response.json({
    paymentId: "pay_mock_123",
    bookingId: "12932849023",
    amount,
    customerDetails,
    selectedDate,
    selectedTime,
    selectedTechnician,
    currency: "EUR",
    status: 1,
    message: "Mock payment successful",
  });
}
