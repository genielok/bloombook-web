import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getStaffInitials, type AdminStaff } from "../components/staff-data";

export const staffColumns: ColumnDef<AdminStaff>[] = [
  {
    id: "name",
    accessorFn: (staff) => `${staff.name} ${staff.email}`,
    header: "Name",
    meta: { cellClassName: "max-w-[180px]" },
    cell: ({ row }) => (
      <Link
        href={`/admin/staff/${row.original.id}`}
        className="flex items-center gap-2.5"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f4ebe2] text-[11px] font-bold text-bloom-text">
          {getStaffInitials(row.original.name)}
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">{row.original.name}</span>
          <span className="block text-xs font-normal text-bloom-subtle">
            {row.original.role}
          </span>
        </span>
      </Link>
    ),
  },
  {
    id: "contact",
    header: "Contact",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-[#5c5147]">
        <p>{row.original.email}</p>
        <p className="text-bloom-subtle">{row.original.phone || "—"}</p>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Action",
    enableSorting: false,
    meta: {
      sticky: "right",
      headerClassName: "w-[100px] text-right",
      cellClassName: "w-[100px] text-right",
    },
    cell: ({ row }) => (
      <Button
        asChild
        variant="link"
        className="h-auto px-0 text-xs font-semibold text-bloom-accent-dark"
      >
        <Link href={`/admin/staff/${row.original.id}`}>Edit →</Link>
      </Button>
    ),
  },
];
