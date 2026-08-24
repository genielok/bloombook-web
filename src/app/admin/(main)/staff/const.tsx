import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getStaffInitials, type AdminStaff } from "../components/staff-data";
import { Badge } from "@/components/ui/badge";

export function getStaffColumns(
  onToggle: (id: string) => void,
): ColumnDef<AdminStaff>[] {
  return [
    {
      id: "name",
      accessorFn: (staff) => `${staff.name} ${staff.email}`,
      header: "Name",
      meta: { cellClassName: "max-w-[160px]" },
      cell: ({ row }) => (
        <Link
          href={`/admin/staff/${row.original.id}`}
          className="flex items-center gap-2.5"
        >
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-bloom-text"
            style={{ backgroundColor: row.original.avatarBg }}
          >
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
      meta: { cellClassName: "max-w-[140px]" },
      cell: ({ row }) => (
        <div className="text-[#5c5147]">
          <p>{row.original.email}</p>
          <p className="text-bloom-subtle">{row.original.phone}</p>
        </div>
      ),
    },
    {
      id: "services",
      header: "Services",
      enableSorting: false,
      meta: { cellClassName: "max-w-[180px] text-[#5c5147]" },
      cell: ({ row }) => (
        <div className="flex max-w-[260px] flex-wrap gap-1.5">
          {row.original.serviceIds.map((id) => (
            <Badge
              key={id}
              className="border-0 bg-[#f4f1ec] text-[11px] font-semibold whitespace-normal text-[#5c5147]"
            >
              {id}
            </Badge>
          ))}
        </div>
      ),
    },

    {
      id: "active",
      header: "Active",
      enableSorting: false,
      meta: {
        headerClassName: "text-center",
        cellClassName: "text-center max-w-[100px]",
      },
      cell: ({ row }) => {
        const staff = row.original;

        return (
          <Button
            type="button"
            role="switch"
            aria-checked={staff.active}
            aria-label={`${staff.active ? "Deactivate" : "Activate"} ${staff.name}`}
            variant="ghost"
            onClick={() => onToggle(staff.id)}
            className={`relative h-5 w-9 rounded-full p-0 ${
              staff.active
                ? "bg-[#7bae8a] hover:bg-[#7bae8a]"
                : "bg-[#e4e4e7] hover:bg-[#e4e4e7]"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${
                staff.active ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </Button>
        );
      },
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
          <Link href={`/admin/staff/${row.original.id}`}>View →</Link>
        </Button>
      ),
    },
  ];
}
