"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  AdminService,
  SERVICE_CATEGORY_LABELS,
} from "../components/services-data";
import { getServiceColumns } from "./const";
import { getServiceList, updateServiceActive } from "@/app/api/admins/admin";
import { ServiceDialog } from "./service-dialog";

export default function AdminServicesPage() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdminService | null>(
    null,
  );
  const [updatingServiceIds, setUpdatingServiceIds] = useState<Set<string>>(
    new Set(),
  );
  const categories = useMemo(
    () =>
      Array.from(new Set(services.map((service) => service.serviceCategory))),
    [services],
  );
  const fetchServiceList = async () => {
    try {
      const { data } = await getServiceList();
      setServices(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    void getServiceList()
      .then(({ data }) => setServices(data))
      .catch((error) => console.log(error));
  }, []);

  const toggleService = useCallback(async (id: string, active: boolean) => {
    setUpdatingServiceIds((current) => new Set(current).add(id));

    try {
      const { data } = await updateServiceActive({ id, active });
      setServices((current) =>
        current.map((service) => (service.id === id ? data : service)),
      );
    } finally {
      setUpdatingServiceIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  }, []);

  const openCreateDialog = () => {
    setEditingService(null);
    setDialogOpen(true);
  };

  const openEditDialog = useCallback((service: AdminService) => {
    setEditingService(service);
    setDialogOpen(true);
  }, []);

  const columns = useMemo(
    () => getServiceColumns(toggleService, openEditDialog, updatingServiceIds),
    [openEditDialog, toggleService, updatingServiceIds],
  );

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <DataTable
        columns={columns}
        data={services}
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
                      {SERVICE_CATEGORY_LABELS[item]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                onClick={openCreateDialog}
                className="h-9 bg-bloom-text px-4 text-[13px] font-semibold text-bloom-bg hover:bg-bloom-text/90"
              >
                <Plus /> Add service
              </Button>
            </div>
          );
        }}
      />
      <ServiceDialog
        open={dialogOpen}
        editingService={editingService}
        onOpenChange={setDialogOpen}
        onSaved={fetchServiceList}
      />
    </div>
  );
}
