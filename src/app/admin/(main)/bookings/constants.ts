import type { BookingStatus } from "../components/bookings-data";

export const bookingStatusLabels: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const bookingStatusOptions = Object.entries(bookingStatusLabels).map(
  ([value, label]) => ({
    value: value as BookingStatus,
    label,
  }),
);

export const bookingStatusFilterOptions: Array<BookingStatus | "All"> = [
  "All",
  ...bookingStatusOptions.map(({ value }) => value),
];

export const bookingStatusClass: Record<BookingStatus, string> = {
  pending: "bg-[#fdf3e7] text-[#a06b3d]",
  confirmed: "bg-[#e6f0e8] text-[#3f7350]",
  completed: "bg-[#e7eef5] text-[#3d6b94]",
  cancelled: "bg-[#fbe9e7] text-[#b0453a]",
};

export const bookingStatusDotClass: Record<BookingStatus, string> = {
  pending: "bg-[#a06b3d]",
  confirmed: "bg-[#3f7350]",
  completed: "bg-[#3d6b94]",
  cancelled: "bg-[#b0453a]",
};
