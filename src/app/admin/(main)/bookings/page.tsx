"use client";

import type { Table as TanStackTable } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { adminBookings, type AdminBooking } from "../components/bookings-data";
import { columns, services, staff, statuses } from "./const";
import { FilterSelect } from "../components/filterSelect";

export default function AdminBookingsPage() {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <DataTable
        columns={columns}
        data={adminBookings}
        emptyMessage="No bookings match your filters."
        onRowClick={(row) => router.push(`/admin/bookings/${row.original.id}`)}
        toolbar={(table) => <BookingsFilters table={table} />}
      />
    </div>
  );
}

function BookingsFilters({ table }: { table: TanStackTable<AdminBooking> }) {
  const globalFilter = (table.getState().globalFilter as string) ?? "";

  const handleSearch = (label: string, value: string) => {
    table.getColumn(label)?.setFilterValue(value === "All" ? undefined : value);
  };
  return (
    <div className="">
      <div className="mb-[18px] flex gap-2.5">
        <div className="relative w-full sm:w-[230px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-bloom-subtle" />
          <Input
            value={globalFilter}
            onChange={(e) => handleSearch("customer", e.target.value)}
            placeholder="Search customer…"
            aria-label="Search customer"
            className="h-9 border-bloom-border bg-white pl-9 text-[13px] shadow-none focus-visible:border-bloom-accent focus-visible:ring-bloom-accent/20"
          />
        </div>

        <Input
          type="date"
          value={(table.getColumn("date")?.getFilterValue() as string) ?? ""}
          onChange={(e) => handleSearch("date", e.target.value)}
          aria-label="Filter by date"
          className="h-9 flex-1 border-bloom-border bg-white text-[13px] shadow-none focus-visible:border-bloom-accent focus-visible:ring-bloom-accent/20"
        />

        <FilterSelect
          value={
            (table.getColumn("status")?.getFilterValue() as string) ?? "All"
          }
          label="All statuses"
          items={statuses}
          onChange={(value) => handleSearch("status", value)}
        />
        <FilterSelect
          value={
            (table.getColumn("staffName")?.getFilterValue() as string) ?? "All"
          }
          label="All staff"
          items={staff}
          onChange={(value) => handleSearch("staffName", value)}
        />
        <FilterSelect
          value={
            (table.getColumn("serviceName")?.getFilterValue() as string) ??
            "All"
          }
          label="All services"
          items={services}
          onChange={(value) => handleSearch("serviceName", value)}
        />
      </div>
    </div>
  );
}
