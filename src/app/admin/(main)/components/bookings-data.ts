import type { AdminService } from "./services-data";
import type { AdminStaff } from "./staff-data";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type AdminBooking = {
  id: string;
  date: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes: string;
  // serviceName: string;
  servicesSnapshot: Array<AdminService>;
  servicesIds: string[];
  duration: number;
  staff?: AdminStaff | null;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string; //internal
};
