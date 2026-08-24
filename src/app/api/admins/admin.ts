import { post } from "@/app/lib/http";
import {
  ApiResponse,
  CreateAccountParams,
  RegisterResponse,
  User,
} from "../clients/types";

export function createAdminAccount(params: CreateAccountParams) {
  return post<ApiResponse<RegisterResponse>>(
    "/api/admin/user/register",
    params,
  );
}

export async function adminSignIn(params: { email: string; password: string }) {
  return post<ApiResponse<User>>("/api/admin/user/login", params);
}

// export async function getBookingList(params) {
//   return post<ApiResponse<Booking>>("/api/admin/user/register", params);
// }
