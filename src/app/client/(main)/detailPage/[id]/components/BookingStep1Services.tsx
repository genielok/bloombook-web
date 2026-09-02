"use client";

import { useMemo, useRef } from "react";
import { Check, Star } from "lucide-react";
import { CategoryFilters } from "../../../explore/components/CategoryFilters";
import { IShopDetail } from "@/app/api/clients/types";

interface BookingStep1ServicesProps {
  shopDetail: IShopDetail;
  selectedServiceIds: string[];
  onToggleService: (serviceId: string) => void;
  onNext: () => void;
}

export function BookingStep1Services({
  shopDetail,
  selectedServiceIds,
  onToggleService,
}: BookingStep1ServicesProps) {
  const categoryList = useMemo(() => {
    const category = [
      ...new Set(shopDetail.serviceItems.map((c) => c.serviceCategory)),
    ].map((category) => ({
      label: category,
      value: category,
      items: shopDetail.serviceItems
        .filter((c) => c.serviceCategory === category)
        .flatMap((c) => (c.name ? [c] : [])),
    }));
    return category;
  }, [shopDetail.serviceItems]);

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleCategoryChange = (category: string) => {
    categoryRefs.current[category]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <div className="min-w-0">
        <div className="mb-4">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bloom-soft text-[28px] font-display font-semibold text-bloom-accent shadow-sm shadow-black/5">
                {shopDetail.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-semibold leading-none text-bloom-text">
                  {shopDetail.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-bloom-subtle">
                  <span>{shopDetail.category}</span>
                  <span>·</span>
                  <span>{shopDetail.address}</span>
                  <span>·</span>
                  {/* <span className="inline-flex items-center gap-1 text-bloom-accent">
                    <Star className="h-4 w-4 fill-current" />
                    {shopDetail.rating} ({shopDetail.reviewNum})
                  </span> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 pt-2 pb-2 flex overflow-x-auto scrollbar-hide h-[50px]">
          <CategoryFilters
            onCategoryChange={handleCategoryChange}
            category={categoryList}
            defaulValue={categoryList[0]?.value ?? ""}
          />
        </div>

        <div>
          {categoryList.map((cat) => (
            <div
              key={cat.value}
              ref={(el) => {
                categoryRefs.current[cat.value] = el;
              }}
              className="[&+&]:mt-6"
            >
              <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-bloom-accent-dark">
                {cat.label}
              </h2>
              <div className="flex flex-col gap-3">
                {cat.items.map((item) => {
                  const isSelected = selectedServiceIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`flex w-full items-center justify-between rounded-card border px-5 py-4.5 text-left transition-colors ${
                        isSelected
                          ? "border-[1.6px] border-bloom-accent bg-bloom-bg"
                          : "border-bloom-border bg-bloom-soft hover:border-bloom-accent/60"
                      }`}
                      onClick={() => onToggleService(item.id)}
                    >
                      <div>
                        <div className="text-base font-semibold text-bloom-text">
                          {item.name}
                        </div>
                        <div className="mt-1 text-[13px] text-bloom-subtle">
                          {item.durationMinutes} min
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-4 pl-6">
                        <span className="font-display text-xl leading-none text-bloom-text">
                          €{item.price}
                        </span>
                        <span
                          className={`flex h-6.5 w-6.5 items-center justify-center rounded-full ${
                            isSelected
                              ? "bg-bloom-accent text-bloom-bg"
                              : "border-[1.6px] border-[#DDD2C5]"
                          }`}
                        >
                          {isSelected && <Check className="h-4 w-4" />}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
