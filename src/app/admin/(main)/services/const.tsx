import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SERVICE_CATEGORY_LABELS,
  type AdminService,
} from "../components/services-data";
import { Switch } from "@/components/ui/switch";

export function getServiceColumns(
  onToggle: (id: string, active: boolean) => Promise<void> | void,
  onEdit: (service: AdminService) => void,
  updatingServiceIds: Set<string>,
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
          {SERVICE_CATEGORY_LABELS[row.original.serviceCategory]}
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
      cell: ({ row }) => `${row.original.durationMinutes} min`,
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
          <Switch
            checked={service.active}
            disabled={updatingServiceIds.has(service.id)}
            onCheckedChange={(active) => {
              void onToggle(service.id, active);
            }}
            aria-label={`${service.active ? "Deactivate" : "Activate"} ${service.name}`}
          />
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
          type="button"
          variant="link"
          onClick={() => onEdit(row.original)}
          className="h-auto px-0 text-xs font-semibold text-bloom-accent-dark"
        >
          Edit
        </Button>
      ),
    },
  ];
}
