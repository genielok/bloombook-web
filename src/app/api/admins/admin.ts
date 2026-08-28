import { post, get } from "@/app/lib/http";
import {
  ApiResponse,
  Booking,
  BusinessHour,
  CreateAccountParams,
  RegisterResponse,
  SalonCategory,
  StudioBasic,
  User,
} from "../clients/types";
import {
  AdminService,
  ServiceCategory,
} from "@/app/admin/(main)/components/services-data";
import { AdminBooking } from "@/app/admin/(main)/components/bookings-data";
import { BookingFormValues } from "@/app/admin/(main)/bookings/const";

export function createAdminAccount(params: CreateAccountParams) {
  return post<ApiResponse<RegisterResponse>>(
    "/api/admin/user/register",
    params,
  );
}

export async function adminSignIn(params: { email: string; password: string }) {
  return post<ApiResponse<RegisterResponse>>("/api/admin/user/login", params);
}

export async function logoutAdmin() {
  return post<ApiResponse<null>>("/api/admin/user/logout", undefined);
}

export async function getCurrentAdminUser() {
  return get<ApiResponse<User>>("/api/admin/user/me");
}

export async function handleUpdateAdminAccount(params: {
  name: string;
  email: string;
}) {
  return post<ApiResponse<User>>("/api/admin/user/update-account", params);
}

export type StudioSettings = {
  name: string;
  category: SalonCategory;
  city: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  imgUrl?: string;
  capacity: number;
  slotIntervalMinutes: number;
  businessHours: BusinessHour[];
};

export async function updateStudioSettings(params: StudioSettings) {
  return post<ApiResponse<StudioBasic>>(
    "/api/admin/salons/update-studio",
    params,
  );
}

export async function getStudioInfo() {
  return get<ApiResponse<StudioBasic>>("/api/admin/salons/detail");
}

export type ServiceFormValues = {
  name: string;
  category: ServiceCategory;
  durationMinutes: number;
  price: number;
  description: string;
  active: boolean;
};

export type EditServiceFormValues = {
  id: string;
  name: string;
  category: ServiceCategory;
  durationMinutes: number;
  price: number;
  description: string;
  active: boolean;
};

export async function createService(params: ServiceFormValues) {
  return post<ApiResponse<AdminService>>("/api/admin/services/create", params);
}
export async function editService(params: EditServiceFormValues) {
  return post<ApiResponse<EditServiceFormValues>>(
    "/api/admin/services/edit",
    params,
  );
}

export async function getServiceList() {
  return get<ApiResponse<AdminService[]>>("/api/admin/services");
}

export async function getBookingList(params: {
  limit: number;
  offset: number;
  customer?: string;
}) {
  return post<ApiResponse<AdminBooking[]>>("/api/admin/bookings/list", params);
}

export function getBookingDetail(
  bookingId: string,
): Promise<ApiResponse<AdminBooking>> {
  return get<ApiResponse<AdminBooking>>(`/api/admin/bookings/${bookingId}`);
}

export function updateBookingDetail(
  params: BookingFormValues & { id: string },
) {
  return post<ApiResponse<AdminBooking>>(`/api/admin/bookings/update`, params);
}
