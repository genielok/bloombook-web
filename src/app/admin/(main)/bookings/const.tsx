import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  bookingStatusClass,
  Staff,
  type AdminBooking,
  type BookingStatus,
} from "../components/bookings-data";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const columns: ColumnDef<AdminBooking>[] = [
  {
    accessorKey: "date",
    header: "Date",
    filterFn: "equalsString",
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.date}</span>
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
  {
    accessorKey: "servicesSnapshot",
    header: "Service",
    filterFn: "equalsString",
    enableGlobalFilter: false,
    meta: { cellClassName: "text-[#5c5147]" },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.servicesSnapshot.map((item) => item.name).join(",")}
        </div>
      );
    },
  },
  {
    accessorKey: "staffName",
    header: "Staff",
    filterFn: "equalsString",
    enableGlobalFilter: false,
    meta: { cellClassName: "text-[#5c5147]" },
    cell: ({ row }) => <div>{row.original.staff?.name || "-"}</div>,
  },
  {
    accessorKey: "totalPrice",
    header: "Price",
    enableGlobalFilter: false,
    meta: {
      headerClassName: "text-right",
      cellClassName: "text-right",
    },
    cell: ({ row }) => (
      <span className="font-semibold">€{row.original.totalPrice}</span>
    ),
  },
  {
    header: "Action",
    enableGlobalFilter: false,
    meta: {
      headerClassName: "text-right",
      cellClassName: "text-right",
    },
    cell: ({ row }) => (
      <Link href={`/admin/bookings/${row.original.id}`}>Edit</Link>
    ),
  },
];

export type BookingFormValues = {
  status: BookingStatus;
  staff?: Staff;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
};

type Option = {
  value: BookingStatus;
  label: string;
};

export const statusOptions: Option[] = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "confirmed",
    label: "Confirmed",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];
