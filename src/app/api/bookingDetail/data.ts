import type { IBookingDetail } from "./types";

const mockBookingDetail: IBookingDetail = {
  bookingId: "12932849023",
  bookingReference: "PETAL-4821",
  status: "confirmed",
  customer: {
    fullName: "Sofia Lindqvist",
    email: "sofia.l@email.com",
    phone: "+49 170 555 0142",
  },
  studio: {
    id: "1",
    name: "Petal Studio",
    area: "Mitte",
    city: "Berlin",
    address: "Auguststraße 24, 10117 Berlin",
    coverLabel: "studio photo",
  },
  appointment: {
    serviceName: "Gel Manicure",
    duration: 45,
    date: "2026-06-20",
    displayDateTime: "Fri 20 Jun 2026 · 14:30",
    time: "14:30",
    technician: "Lena",
  },
  receipt: {
    currency: "EUR",
    lineItems: [
      {
        id: "gel-manicure",
        label: "Gel Manicure",
        amount: 45,
      },
    ],
    promo: {
      code: "PETAL10",
      label: "Promo · PETAL10 (−10%)",
      discount: 4.5,
    },
    paid: {
      amount: 40.5,
      method: "Visa",
      last4: "42",
      display: "€40.50 · Visa ••42",
    },
  },
  policy: {
    reschedule: "Free up to 24h before",
  },
};

export function getBookingDetailData(bookingId: string): IBookingDetail {
  return {
    ...mockBookingDetail,
    bookingId,
  };
}
