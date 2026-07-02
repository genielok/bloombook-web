export interface IBookingDetail {
  bookingId: string;
  bookingReference: string;
  status: "confirmed" | "cancelled" | "pending";
  customer: IBookingCustomer;
  studio: IBookingStudio;
  appointment: IBookingAppointment;
  receipt: IBookingReceipt;
  policy: IBookingPolicy;
}

export interface IBookingCustomer {
  fullName: string;
  email: string;
  phone: string;
}

export interface IBookingStudio {
  id: string;
  name: string;
  area: string;
  city: string;
  address: string;
  coverLabel: string;
}

export interface IBookingAppointment {
  serviceName: string;
  duration: number;
  date: string;
  displayDateTime: string;
  time: string;
  technician: string;
}

export interface IBookingReceipt {
  currency: "EUR";
  lineItems: IBookingReceiptLineItem[];
  promo?: IBookingReceiptPromo;
  paid: IBookingReceiptPaid;
}

export interface IBookingReceiptLineItem {
  id: string;
  label: string;
  amount: number;
}

export interface IBookingReceiptPromo {
  code: string;
  label: string;
  discount: number;
}

export interface IBookingReceiptPaid {
  amount: number;
  method: string;
  last4: string;
  display: string;
}

export interface IBookingPolicy {
  reschedule: string;
}
