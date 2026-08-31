"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { getStaffList } from "@/app/api/admins/admin";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import type { AdminStaff } from "../components/staff-data";
import { staffColumns } from "./const";

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<AdminStaff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStaff = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const { data } = await getStaffList();
      setStaff(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load staff.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void getStaffList()
      .then(({ data }) => {
        if (!cancelled) setStaff(data);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load staff.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      {error && (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{error}</span>
          <Button type="button" variant="link" onClick={loadStaff}>
            Try again
          </Button>
        </div>
      )}

      <DataTable
        columns={staffColumns}
        data={staff}
        showPagination={false}
        tableClassName="min-w-[680px]"
        emptyMessage={isLoading ? "Loading staff…" : "No staff members found."}
        toolbar={(table) => {
          const search = (table.getState().globalFilter as string) ?? "";

          return (
            <div className="mb-[18px] flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
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
