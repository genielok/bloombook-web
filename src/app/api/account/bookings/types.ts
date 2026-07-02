export type AccountBookingStatus = "Confirmed" | "Completed" | "Cancelled";

export interface AccountBooking {
  bookingId: string;
  referenceNumber: string;
  service: string;
  meta: string;
  status: AccountBookingStatus;
  statusClass: string;
  action: string;
  actionHref: string;
  studioName?: string;
  studioArea?: string;
  studioAddress?: string;
  displayDateTime?: string;
  technician?: string;
  duration?: number;
  price?: number;
  paymentMethod?: string;
  paymentLast4?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  reschedulePolicy?: string;
  endTime?: string;
  timeRange?: string;
  studioPhone?: string;
  studioEmail?: string;
  serviceItems?: AccountBookingServiceItem[];
  promoLabel?: string;
  promoDiscount?: number;
  totalPaid?: number;
}

export interface AccountBookingServiceItem {
  id: string;
  name: string;
  duration: number;
  technician: string;
  price: number;
}

export interface AccountBookingsResponse {
  upcoming: AccountBooking[];
  history: AccountBooking[];
}
