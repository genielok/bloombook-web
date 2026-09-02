import { get, post, upload } from "@/app/lib/http";
import {
  ApiResponse,
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
import {
  AdminBooking,
  BookingStatus,
} from "@/app/admin/(main)/components/bookings-data";
import { BookingFormValues } from "@/app/admin/(main)/bookings/const";
import {
  type AdminStaff,
  type StaffFormValues,
} from "@/app/admin/(main)/components/staff-data";

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

export async function createStudio(params: StudioSettings) {
  return post<ApiResponse<StudioBasic>>("/api/admin/salons/create", params);
}

export async function getStudioInfo(options?: { showErrorToast?: boolean }) {
  return get<ApiResponse<StudioBasic>>("/api/admin/salons/detail", options);
}

export function uploadStudioImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return upload<ApiResponse<{ url: string }>>("/api/upload", formData);
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
  return post<ApiResponse<AdminService>>(
    "/api/admin/services/edit",
    params,
  );
}

export function updateServiceActive(params: { id: string; active: boolean }) {
  return post<ApiResponse<AdminService>>(
    "/api/admin/services/status",
    params,
  );
}

export async function getServiceList() {
  return get<ApiResponse<AdminService[]>>("/api/admin/services");
}

export function getStaffList() {
  return get<ApiResponse<AdminStaff[]>>("/api/admin/staff");
}

export function createStaff(params: StaffFormValues) {
  return post<ApiResponse<AdminStaff>>("/api/admin/staff/create", params);
}

export function editStaff(params: StaffFormValues & { id: string }) {
  return post<ApiResponse<AdminStaff>>("/api/admin/staff/edit", params);
}

export function deleteStaff(id: string) {
  return post<ApiResponse<null>>("/api/admin/staff/delete", { id });
}

export async function getBookingList(params: {
  limit: number;
  offset: number;
  customer?: string;
}) {
  return post<ApiResponse<AdminBooking[]>>("/api/admin/bookings/list", params);
}

export type CalendarBookingParams = {
  startDate: string;
  endDate: string;
  status: BookingStatus | null;
  staffId: string | null;
  unassignedOnly: boolean;
};

export function getCalendarBookings(params: CalendarBookingParams) {
  return post<ApiResponse<AdminBooking[]>>(
    "/api/admin/bookings/calendar",
    params,
  );
}

export type DashboardRevenueDay = {
  date: string;
  amount: number;
};

export type AdminDashboardData = {
  revenueLast7Days: DashboardRevenueDay[];
  todayBookingsCount: number;
  upcomingBookingsCount: number;
  completedThisMonthCount: number;
  todayBookings: AdminBooking[];
};

export function getAdminDashboard() {
  return get<ApiResponse<AdminDashboardData>>("/api/admin/dashboard");
}

export function getBookingDetail(
  bookingId: string,
): Promise<ApiResponse<AdminBooking>> {
  return get<ApiResponse<AdminBooking>>(`/api/admin/bookings/${bookingId}`);
}

export function updateBookingDetail(
  params: BookingFormValues & { id: string },
) {
  const { staffId, ...booking } = params;

  return post<ApiResponse<AdminBooking>>(`/api/admin/bookings/update`, {
    ...booking,
    staffId: staffId || null,
  });
}
