import type { AdminService } from "./services-data";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type Staff = {
  id: string;
  name: string;
  contact: {
    email: string;
    phone: string;
  };
};
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
  staff?: Staff;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string; //internal
};

export const bookingStatusClass: Record<BookingStatus, string> = {
  pending: "bg-[#fdf3e7] text-[#a06b3d]",
  confirmed: "bg-[#e7eef5] text-[#3d6b94]",
  completed: "bg-[#e6f0e8] text-[#3f7350]",
  cancelled: "bg-[#fbe9e7] text-[#b0453a]",
  // "No-show": "bg-[#f3e7e9] text-[#8a4a5c]",
};
