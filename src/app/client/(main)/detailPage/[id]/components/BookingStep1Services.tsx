"use client";

import { useMemo, useRef } from "react";
import { ArrowRight, Check, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IShopDetail } from "@/app/api/shopDetail/types";
import { CategoryFilters } from "../../../explore/components/CategoryFilters";

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
  onNext,
}: BookingStep1ServicesProps) {
  const categoryList = useMemo(() => {
    return shopDetail.services.map((cat) => ({
      value: cat.category,
      label: cat.category,
      items: cat.items,
    }));
  }, [shopDetail.services]);

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allItems = shopDetail.services.flatMap((c) => c.items);
  const selectedServices = allItems.filter((item) =>
    selectedServiceIds.includes(item.id),
  );
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce(
    (sum, s) => sum + s.duration,
    0,
  );

  const handleCategoryChange = (category: string) => {
    categoryRefs.current[category]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
      <div className="min-w-0">
        <div className="relative mb-8 h-50 overflow-hidden rounded-xs bg-[repeating-linear-gradient(45deg,#EFE0D0,#EFE0D0_16px,#E7D6C3_16px,#E7D6C3_32px)]">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(34,30,26,0.45)_100%)]" />
          <div className="absolute bottom-6 left-8">
            <div className="flex items-end gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-bloom-bg bg-bloom-soft font-display text-[26px] text-bloom-accent">
                {shopDetail.logoText}
              </div>
              <h1 className="pb-1 font-display text-2xl leading-none text-white">
                {shopDetail.name}
              </h1>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[13px] text-white/85">
              <span>{shopDetail.type}</span>
              <span>·</span>
              <MapPin className="h-3.5 w-3.5" />
              <span>{shopDetail.location}</span>
              <span>·</span>
              <Star className="h-3.5 w-3.5 fill-bloom-accent text-bloom-accent" />
              <span>
                {shopDetail.rating} ({shopDetail.reviewCount})
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6 pt-2 pb-2 flex overflow-x-auto  scrollbar-hide">
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
                          {item.duration} min
                          {item.note ? ` · ${item.note}` : ""}
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

      <div className="mt-8 lg:mt-8">
        <div className="sticky top-6">
          <div className="overflow-hidden rounded-panel border border-bloom-border bg-white">
            <div className="border-b border-bloom-border bg-bloom-soft px-6 py-5.5">
              <div className="mb-2 text-xs uppercase tracking-[0.12em] text-bloom-accent-dark">
                Your booking
              </div>
              <h3 className="font-display text-2xl leading-tight text-bloom-text">
                {selectedServices[0]?.name ?? "Select services"}
              </h3>
              <div className="mt-1 text-[13px] text-bloom-subtle">
                {selectedServices.length === 0
                  ? "Choose a service to continue"
                  : `${totalDuration} minutes`}
              </div>
            </div>

            <div className="flex flex-col gap-3 px-6 py-5.5">
              <div className="flex justify-between">
                <span className="text-sm text-bloom-subtle">Service</span>
                <span className="text-right text-sm font-semibold text-bloom-text">
                  {selectedServices.length === 0
                    ? "Not selected"
                    : selectedServices
                        .map((service) => service.name)
                        .join(", ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-bloom-subtle">Studio</span>
                <span className="text-right text-sm font-semibold text-bloom-text">
                  {shopDetail.name}, {shopDetail.location.split(",")[0]}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-bloom-border pt-3.5">
                <span className="text-sm text-bloom-subtle">Total</span>
                <span className="font-display text-[28px] leading-none text-bloom-text">
                  €{totalPrice}.00
                </span>
              </div>

              <Button
                onClick={onNext}
                disabled={selectedServices.length === 0}
                className="mt-2 w-full rounded-full bg-bloom-accent py-6 text-base font-semibold text-bloom-bg hover:bg-bloom-accent-dark"
              >
                Next: choose time
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
