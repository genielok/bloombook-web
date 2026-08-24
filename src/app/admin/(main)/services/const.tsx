import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminService } from "../components/services-data";

export function getServiceColumns(
  onToggle: (id: string) => void,
): ColumnDef<AdminService>[] {
  return [
    {
      accessorKey: "name",
      header: "Service",
      meta: { cellClassName: "font-semibold" },
    },
    {
      accessorKey: "category",
      header: "Category",
      filterFn: "equalsString",
      cell: ({ row }) => (
        <Badge className="border-0 bg-[#f4f1ec] px-2.5 text-[11px] font-semibold text-[#5c5147]">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      meta: {
        headerClassName: "text-right",
        cellClassName: "text-right text-[#5c5147]",
      },
      cell: ({ row }) => `${row.original.duration} min`,
    },
    {
      accessorKey: "price",
      header: "Price",
      meta: {
        headerClassName: "text-right",
        cellClassName: "text-right font-semibold",
      },
      cell: ({ row }) => `€${row.original.price}`,
    },
    {
      accessorKey: "staffCount",
      header: "Staff",
      meta: {
        headerClassName: "text-right",
        cellClassName: "text-right text-[#5c5147]",
      },
    },
    {
      id: "status",
      accessorFn: (service) => (service.active ? "Active" : "Inactive"),
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`text-xs font-semibold ${
            row.original.active ? "text-[#3f7350]" : "text-bloom-subtle"
          }`}
        >
          {row.original.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "active",
      header: "Active",
      enableSorting: false,
      meta: {
        headerClassName: "text-center",
        cellClassName: "text-center",
      },
      cell: ({ row }) => {
        const service = row.original;

        return (
          <Button
            type="button"
            role="switch"
            aria-checked={service.active}
            aria-label={`${service.active ? "Deactivate" : "Activate"} ${service.name}`}
            variant="ghost"
            onClick={() => onToggle(service.id)}
            className={`relative h-5 w-9 rounded-full p-0 ${
              service.active
                ? "bg-[#7bae8a] hover:bg-[#7bae8a]"
                : "bg-[#e4e4e7] hover:bg-[#e4e4e7]"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${
                service.active ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </Button>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      meta: {
        headerClassName: "text-right",
        cellClassName: "text-right",
      },
      cell: ({ row }) => (
        <Button
          asChild
          variant="link"
          className="h-auto px-0 text-xs font-semibold text-bloom-accent-dark"
        >
          <Link href={`/admin/services/new?service=${row.original.id}`}>
            Edit
          </Link>
        </Button>
      ),
    },
  ];
}
