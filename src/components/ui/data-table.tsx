"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type Row,
  type SortingState,
  type Table as TanStackTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { Pagination } from "@/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
    sticky?: "left" | "right";
  }
}

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  toolbar?: (table: TanStackTable<TData>) => React.ReactNode;
  onRowClick?: (row: Row<TData>) => void;
  emptyMessage?: string;
  pageSize?: number;
  showPagination?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
  };
  className?: string;
  tableClassName?: string;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  toolbar,
  onRowClick,
  emptyMessage = "No results.",
  pageSize = 10,
  showPagination = true,
  pagination: controlledPagination,
  className,
  tableClassName,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const isServerPagination = Boolean(controlledPagination);
  const activePagination: PaginationState = controlledPagination
    ? {
        pageIndex: Math.max(0, controlledPagination.page - 1),
        pageSize: controlledPagination.pageSize,
      }
    : pagination;

  // TanStack Table returns callback APIs that React Compiler intentionally skips.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination: activePagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: isServerPagination ? undefined : setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: showPagination && !isServerPagination
      ? getPaginationRowModel()
      : undefined,
    manualPagination: isServerPagination,
    pageCount: controlledPagination
      ? Math.max(
          1,
          Math.ceil(controlledPagination.total / controlledPagination.pageSize),
        )
      : undefined,
  });

  const filteredCount = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize: activePageSize } = table.getState().pagination;

  const openRow = (row: Row<TData>) => onRowClick?.(row);

  return (
    <div className={cn("w-full", className)}>
      {toolbar?.(table)}

      <div className="overflow-hidden rounded-[10px] border border-bloom-border bg-white">
        <Table className={cn("min-w-[940px] border-collapse", tableClassName)}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-0 bg-[#faf6f1] hover:bg-[#faf6f1]"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "h-auto px-5 py-[11px] text-left text-[11px] font-semibold tracking-[0.06em] text-bloom-subtle uppercase",
                      header.column.columnDef.meta?.sticky === "left" &&
                        "sticky left-0 z-20 bg-[#faf6f1] shadow-[4px_0_8px_-6px_rgba(34,30,26,0.25)]",
                      header.column.columnDef.meta?.sticky === "right" &&
                        "sticky right-0 z-20 bg-[#faf6f1] shadow-[-4px_0_8px_-6px_rgba(34,30,26,0.25)]",
                      header.column.columnDef.meta?.headerClassName,
                    )}
                  >
                    {!header.isPlaceholder && (
                      header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            "inline-flex items-center gap-1.5 hover:text-bloom-text",
                            header.column.columnDef.meta?.headerClassName?.includes(
                              "text-right",
                            ) && "ml-auto",
                          )}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUp className="size-3" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown className="size-3" />
                          ) : (
                            <ChevronsUpDown className="size-3 opacity-50" />
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={() => openRow(row)}
                  onKeyDown={(event) => {
                    if (
                      onRowClick &&
                      (event.key === "Enter" || event.key === " ")
                    ) {
                      event.preventDefault();
                      openRow(row);
                    }
                  }}
                  className={cn(
                    "group/data-row border-[#f0e9e1] outline-none hover:bg-[#faf6f1]",
                    onRowClick &&
                      "cursor-pointer focus-visible:bg-[#faf6f1] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-bloom-accent",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "px-5 py-3 text-left text-[13px]",
                        cell.column.columnDef.meta?.sticky === "left" &&
                          "sticky left-0 z-10 bg-white shadow-[4px_0_8px_-6px_rgba(34,30,26,0.25)] group-hover/data-row:bg-[#faf6f1]",
                        cell.column.columnDef.meta?.sticky === "right" &&
                          "sticky right-0 z-10 bg-white shadow-[-4px_0_8px_-6px_rgba(34,30,26,0.25)] group-hover/data-row:bg-[#faf6f1]",
                        cell.column.columnDef.meta?.cellClassName,
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-white">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-[13px] text-bloom-subtle"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {showPagination && (
          <Pagination
            page={pageIndex + 1}
            pageSize={activePageSize}
            total={controlledPagination?.total ?? filteredCount}
            onPageChange={(page) => {
              if (controlledPagination) {
                controlledPagination.onPageChange(page);
                return;
              }
              table.setPageIndex(page - 1);
            }}
            disabled={controlledPagination?.disabled}
            className="border-t border-[#f0e9e1] px-5 py-3.5"
          />
        )}
      </div>
    </div>
  );
}
