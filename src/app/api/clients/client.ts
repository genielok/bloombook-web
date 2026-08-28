import { get, post, upload } from "../../lib/http";
import {
  ApiResponse,
  AvaliableDateResponse,
  Booking,
  CreateAccountParams,
  IShopDetail,
  IStudio,
  RegisterResponse,
  ReqBookParams,
  ResBook,
  SearchStudioParams,
  UpateProfileParams,
  User,
} from "../clients/types";

export function getStudios(
  params: SearchStudioParams,
): Promise<ApiResponse<IStudio[]>> {
  return post<ApiResponse<IStudio[]>>(`/api/salons/search`, params);
}

export function fetchShopDetail(
  salonId: string,
): Promise<ApiResponse<IShopDetail>> {
  return get<ApiResponse<IShopDetail>>(`/api/salons/details/${salonId}`);
}

export function fetchAvalibleSlots({
  salonId,
  startDate,
  serviceIds,
}: {
  salonId: string;
  startDate: number;
  serviceIds: string[];
}): Promise<ApiResponse<AvaliableDateResponse>> {
  return post<ApiResponse<AvaliableDateResponse>>("/api/salons/availability", {
    salonId,
    startDate,
    serviceIds,
  });
}

export interface ResPromo {
  available: boolean;
}

export function validPromo(promo: string): Promise<ResPromo> {
  return post<ResPromo>("/api/api/payment/promo", { promo });
}

export function confirmBook(
  params: ReqBookParams,
): Promise<ApiResponse<ResBook>> {
  return post<ApiResponse<ResBook>>("/api/bookings/create", params);
}

export function getMyBookings(
  type?: "upcoming" | "history",
): Promise<ApiResponse<Booking[]>> {
  return get(`/api/bookings?type=${type}`);
}

export function signIn(params: { email: string; password: string }) {
  return post<ApiResponse<RegisterResponse>>("/api/user/login", params);
}

export function logoutClient() {
  return post<ApiResponse<null>>("/api/user/logout", undefined);
}

export function createAccount(params: CreateAccountParams) {
  return post<ApiResponse<RegisterResponse>>("/api/user/register", params);
}

export function cancelBooking(params: { bookingId: string }) {
  return post<ApiResponse<{ reference: string }>>(
    `/api/bookings/${params.bookingId}/cancel`,
    params,
  );
}

export function fetchBookingDetail(
  bookingId: string,
): Promise<ApiResponse<Booking>> {
  return get<ApiResponse<Booking>>(`/api/bookings/by-reference/${bookingId}`);
}

export function rescheduleBooking(params: { id: string; bookingTime: number }) {
  return post<ApiResponse<Booking>>("/api/bookings/reschedule", params);
}

export function updateProfile(params: UpateProfileParams) {
  return post<ApiResponse<User>>("/api/user/update_profile", params);
}

export function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return upload<ApiResponse<{ url: string }>>("/api/upload", formData);
}
