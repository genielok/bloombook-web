import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  adminBookings,
  bookingStatusClass,
  type AdminBooking,
  type BookingStatus,
} from "../components/bookings-data";

export const columns: ColumnDef<AdminBooking>[] = [
  {
    accessorKey: "date",
    header: "Date",
    filterFn: "equalsString",
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.dateLabel}</span>
    ),
  },
  {
    accessorKey: "startTime",
    header: "Time",
    enableGlobalFilter: false,
    meta: { cellClassName: "text-[#5c5147]" },
  },
  {
    id: "customer",
    accessorFn: (booking) => `${booking.customerName} ${booking.customerEmail}`,
    header: "Customer",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <div>
        <p className="font-semibold">{row.original.customerName}</p>
        <p className="text-xs font-normal text-bloom-subtle">
          {row.original.customerEmail}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "serviceName",
    header: "Service",
    filterFn: "equalsString",
    enableGlobalFilter: false,
    meta: { cellClassName: "text-[#5c5147]" },
  },
  {
    accessorKey: "staffName",
    header: "Staff",
    filterFn: "equalsString",
    enableGlobalFilter: false,
    meta: { cellClassName: "text-[#5c5147]" },
  },
  {
    accessorKey: "price",
    header: "Price",
    enableGlobalFilter: false,
    meta: {
      headerClassName: "text-right",
      cellClassName: "text-right",
    },
    cell: ({ row }) => (
      <span className="font-semibold">€{row.original.price}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "equalsString",
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <Badge
        className={`h-[22px] border-0 px-2.5 text-[11px] font-semibold ${bookingStatusClass[row.original.status]}`}
      >
        {row.original.status}
      </Badge>
    ),
  },
];

export const statuses: Array<BookingStatus | "All"> = [
  "All",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
  "No-show",
];

export const staff = [
  "All",
  "Unassigned",
  "Mara Voss",
  "Lena Hoffmann",
  "Emma Richter",
  "Sophia Lindqvist",
];

export const services = [
  "All",
  ...Array.from(new Set(adminBookings.map((booking) => booking.serviceName))),
];
