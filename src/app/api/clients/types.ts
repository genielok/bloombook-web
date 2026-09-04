import { BookingStatus } from "@/app/admin/(main)/components/bookings-data";

export interface IBookingDetail {
  bookingId: string;
  bookingReference: string;
  status: "confirmed" | "cancelled" | "pending";
  customer: IBookingCustomer;
  studio: IBookingStudio;
  appointment: IBookingAppointment;
  receipt: IBookingReceipt;
  policy: IBookingPolicy;
  reference: string;
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

export interface IShopDetail {
  id: string;
  name: string;
  rating: string;
  reviewNum: number;
  category: string;
  city: string;
  address: string;
  serviceTags: string[];
  imgUrl: string;
  description: string;
  phone: string;
  email: string;
  serviceItems: IServiceItem[];
}

export interface IServiceItem {
  id: string;
  name: string;
  serviceCategory: string;
  price: number;
  durationMinutes: number;
}

export interface ISlot {
  date: string;
  hasAvailability: boolean;
  availableTimes: string[];
}

export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
  total: number;
};

export enum ECategory {
  all = "All",
  hair = "Hair",
  nails = "Nails",
  massage = "Massage",
  spa = "Spa",
  barber = "Barber",
}

export type SalonCategory =
  | "hair"
  | "nails"
  | "massage"
  | "spa"
  | "barber"
  | "makeup"
  | "tanning"
  | "waxing";

export type BusinessHour = {
  day: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
};

export interface StudioBasic {
  name: string;
  rating?: string;
  category: SalonCategory;
  city: string;
  address: string;
  services?: string[];
  imgUrl: string;
  description: string;
  capacity: number;
  slotIntervalMinutes: number;
  phone: string;
  email: string;
  businessHours: BusinessHour[];
}
export interface IStudio extends StudioBasic {
  id: string;
}

export interface SearchStudioParams {
  location?: string;
  searchText?: string;
  category?: string;
}

export interface AvaliableDateResponse {
  date: string;
  days: ISlot[];
}

export interface ReqBookParams {
  salonId: string;
  bookingTime: number;
  serviceIds: string[];
  servicesSnapshot: {
    id: string;
    name: string;
    durationMinutes: number;
    price: number;
  }[];
  customer: {
    name: string;
    email: string;
    phone: string;
    note?: string;
  };
}

enum Status {
  faild,
  succes,
}
export interface ResBook {
  id: string;
  status: Status;
  reference: string;
}

export interface Booking {
  id: string;
  reference: string;
  salonId: string;
  salon: {
    name: string;
    city: string;
    address: string;
    imgUrl: string;
    description: string;
    email: string;
    phone: string;
  };
  serviceIds: string[];
  servicesSnapshot: {
    id: string;
    name: string;
    durationMinutes: number;
    price: number;
  }[];
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  note?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
}

export interface CreateAccountParams {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}

export interface UpateProfileParams {
  name: string;
  avatarImg?: string;
  phone?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "client" | "admin";
  avatarImg?: string;
  phone?: string;
  isDemo: boolean;
}
