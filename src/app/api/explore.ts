import { User } from "@/types/user";
import { get, post } from "../lib/http";
import type { AccountBookingsResponse } from "./account/bookings/types";
import type { IBookingDetail } from "./bookingDetail/types";
import type { IShopDetail, ISlot } from "./shopDetail/types";

interface DataPros<T> {
  total: number;
  page: number;
  dataList: T[];
}

export interface IStudio {
  id: string;
  name: string;
  rating: string;
  category: string;
  location: string;
  services?: string[];
  availableToday: boolean;
  price?: string;
}

interface SearchStudioParams {
  location?: string;
  salon?: string;
  category: string;
}

export function getStudios(
  params: SearchStudioParams,
): Promise<DataPros<IStudio>> {
  return post<DataPros<IStudio>>("/api/explore", { body: params });
}

export function fetchShopDetail(shopId: string): Promise<IShopDetail> {
  return get<IShopDetail>(`/api/shopDetail?id=${shopId}`);
}

export function fetchAvalibleSlots({
  shopId,
  startDate,
}: {
  shopId: string;
  startDate: string;
}): Promise<ISlot[]> {
  return post<ISlot[]>("/api/shopDetail/slots", { shopId, startDate });
}

export interface ResPromo {
  available: boolean;
}

export function validPromo(promo: string): Promise<ResPromo> {
  return post<ResPromo>("/api/payment/promo", { promo });
}

export interface ReqBookParams {
  selectedDate: string;
  selectedTime: string;
  selectedTechnician: string;
  selectedServiceIds: string[];
  customerDetails?: {
    fullName: string;
    phone: string;
    email: string;
    note: string;
  };
}
enum Status {
  faild,
  succes,
}
export interface ResBook {
  bookingId: string;
  paymentId: string;
  status: Status;
  message: "Mock payment successful";
}
export function confirmBook(params: ReqBookParams): Promise<ResBook> {
  return post<ResBook>("/api/payment", params);
}

export function getBookingDetail(bookingId: string): Promise<IBookingDetail> {
  return get<IBookingDetail>(
    `/api/bookingDetail?bookingId=${encodeURIComponent(bookingId)}`,
  );
}

export function getAccountBookings(): Promise<AccountBookingsResponse> {
  return get<AccountBookingsResponse>("/api/account/bookings");
}

export function signIn(params: { email: string; password: string }) {
  return post<{ message: string; user: User; ok: boolean }>(
    "/api/auth-mock/login",
    params,
  );
}

export interface CreateAccountParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function createAccount(params: CreateAccountParams) {
  return post<{ message: string; user: User; ok: boolean }>(
    "/api/auth-mock/register",
    params,
  );
}

export function cancelBooking(params: { bookingId: string }) {
  return post<{ message: string; ok: boolean }>(
    "/api/bookingDetail/cancel",
    params,
  );
}
