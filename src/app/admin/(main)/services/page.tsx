"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminServices } from "../components/services-data";
import { getServiceColumns } from "./const";

export default function AdminServicesPage() {
  const [services, setServices] = useState(adminServices);
  const categories = useMemo(
    () => Array.from(new Set(services.map((service) => service.category))),
    [services],
  );

  const toggleService = useCallback((id: string) => {
    setServices((current) =>
      current.map((service) =>
        service.id === id
          ? { ...service, active: !service.active }
          : service,
      ),
    );
  }, []);

  const columns = useMemo(
    () => getServiceColumns(toggleService),
    [toggleService],
  );

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <DataTable
        columns={columns}
        data={services}
        showPagination={false}
        tableClassName="min-w-[900px]"
        emptyMessage="No services found."
        toolbar={(table) => {
          const category =
            (table.getColumn("category")?.getFilterValue() as string) ?? "All";

          return (
            <div className="mb-[18px] flex items-center justify-between gap-3">
              <Select
                value={category}
                onValueChange={(value) =>
                  table
                    .getColumn("category")
                    ?.setFilterValue(value === "All" ? undefined : value)
                }
              >
                <SelectTrigger className="h-9 min-w-[160px] border-bloom-border bg-white text-[13px] shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All categories</SelectItem>
                  {categories.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                asChild
                className="h-9 bg-bloom-text px-4 text-[13px] font-semibold text-bloom-bg hover:bg-bloom-text/90"
              >
                <Link href="/admin/services/new">
                  <Plus /> Add service
                </Link>
              </Button>
            </div>
          );
        }}
      />
    </div>
  );
}
