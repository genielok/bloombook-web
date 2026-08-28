"use client";

import type { MouseEvent } from "react";

import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type PageItem = number | "ellipsis-start" | "ellipsis-end";

export type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
};

function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis-end", totalPages];
  }

  if (page >= totalPages - 3) {
    return [
      1,
      "ellipsis-start",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis-start",
    page - 1,
    page,
    page + 1,
    "ellipsis-end",
    totalPages,
  ];
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  disabled = false,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, total);

  const goToPage = (nextPage: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (disabled || nextPage < 1 || nextPage > totalPages) return;
    onPageChange(nextPage);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <span className="text-xs text-bloom-subtle">
        Showing {rangeStart}–{rangeEnd} of {total}
      </span>

      <PaginationRoot className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text="Prev"
              aria-disabled={disabled || currentPage === 1}
              tabIndex={disabled || currentPage === 1 ? -1 : undefined}
              onClick={goToPage(currentPage - 1)}
              className={cn(
                "border border-bloom-border bg-white text-xs shadow-none",
                (disabled || currentPage === 1) &&
                  "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>

          {getPageItems(currentPage, totalPages).map((item) =>
            typeof item === "number" ? (
              <PaginationItem key={item}>
                <PaginationLink
                  href="#"
                  size="icon-sm"
                  isActive={item === currentPage}
                  aria-label={`Go to page ${item}`}
                  aria-disabled={disabled}
                  tabIndex={disabled ? -1 : undefined}
                  onClick={goToPage(item)}
                  className={cn(
                    "text-xs",
                    disabled && "pointer-events-none opacity-50",
                  )}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationEllipsis />
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={disabled || currentPage === totalPages}
              tabIndex={
                disabled || currentPage === totalPages ? -1 : undefined
              }
              onClick={goToPage(currentPage + 1)}
              className={cn(
                "border border-bloom-border bg-white text-xs shadow-none",
                (disabled || currentPage === totalPages) &&
                  "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationRoot>
    </div>
  );
}
