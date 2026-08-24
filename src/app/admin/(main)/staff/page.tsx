"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminStaff } from "../components/staff-data";
import { getStaffColumns } from "./const";

export default function AdminStaffPage() {
  const [staff, setStaff] = useState(adminStaff);
  const toggleStaff = useCallback((id: string) => {
    setStaff((current) =>
      current.map((member) =>
        member.id === id ? { ...member, active: !member.active } : member,
      ),
    );
  }, []);
  const columns = useMemo(() => getStaffColumns(toggleStaff), [toggleStaff]);

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <DataTable
        columns={columns}
        data={staff}
        showPagination={false}
        tableClassName="min-w-[980px]"
        emptyMessage="No team members match your filters."
        toolbar={(table) => {
          const search = (table.getState().globalFilter as string) ?? "";
          const status =
            (table.getColumn("status")?.getFilterValue() as string) ?? "All";

          return (
            <div className="mb-[18px] flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <div className="relative w-full sm:w-[230px]">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-bloom-subtle" />
                  <Input
                    value={search}
                    onChange={(event) => table.setGlobalFilter(event.target.value)}
                    placeholder="Search name or email…"
                    aria-label="Search staff by name or email"
                    className="h-9 border-bloom-border bg-white pl-9 text-[13px] shadow-none focus-visible:border-bloom-accent focus-visible:ring-bloom-accent/20"
                  />
                </div>
                <Select
                  value={status}
                  onValueChange={(value) =>
                    table
                      .getColumn("status")
                      ?.setFilterValue(value === "All" ? undefined : value)
                  }
                >
                  <SelectTrigger className="h-9 min-w-[140px] border-bloom-border bg-white text-[13px] shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                asChild
                className="h-9 bg-bloom-text px-4 text-[13px] font-semibold text-bloom-bg hover:bg-bloom-text/90"
              >
                <Link href="/admin/staff/new">
                  <Plus /> Add staff
                </Link>
              </Button>
            </div>
          );
        }}
      />
    </div>
  );
}
