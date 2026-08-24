"use client";

import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { CustomerDetails } from "./BookingStep3Details";
import { IShopDetail } from "@/app/api/clients/types";

interface BookingSidebarProps {
  step: number;
  shopDetail: IShopDetail;
  selectedDate: string;
  selectedTime: string;
  onNext: () => void;
  onConfirm: () => void;
  buttonLabel?: string;
  selectedServiceIds: string[];
  customerDetails: CustomerDetails;
  isLoading?: boolean;
}

export function BookingSidebar({
  step,
  shopDetail,
  selectedDate,
  selectedTime,
  onNext,
  onConfirm,
  buttonLabel = "Continue",
  selectedServiceIds,
  customerDetails,
  isLoading = false,
}: BookingSidebarProps) {
  const selectedServices = shopDetail.serviceItems.filter((item) =>
    selectedServiceIds.includes(item.id),
  );

  const total = selectedServices.reduce((sum, s) => sum + (s.price ?? 0), 0);

  const totalDuration = selectedServices.reduce(
    (sum, s) => sum + (s.durationMinutes ?? 0),
    0,
  );

  const bookingTitle =
    selectedServices.length === 1
      ? selectedServices[0].name
      : `${selectedServices.length} services`;

  const whenLabel =
    selectedDate && selectedTime
      ? `${dayjs(selectedDate).format("ddd DD MMM")} · ${selectedTime}`
      : "Select date & time";

  const canContinue = (() => {
    if (step === 1) return selectedServiceIds.length > 0;
    if (step === 2) return selectedDate && selectedTime;
    if (step === 3)
      return (
        customerDetails.fullName &&
        customerDetails.phone &&
        customerDetails.email
      );
    return true;
  })();

  const onContinue = () => {
    if (step === 3) {
      onConfirm();
    } else {
      onNext();
    }
  };

  return (
    <div>
      <div className="sticky top-6">
        <div className="overflow-hidden rounded-panel border border-bloom-border bg-white">
          <div className="border-b border-bloom-border bg-bloom-soft px-6 py-[22px]">
            <div className="mb-2 text-xs uppercase tracking-[0.12em] text-bloom-accent-dark">
              Your booking
            </div>
            <h3 className="font-display text-2xl leading-tight text-bloom-text">
              {bookingTitle}
            </h3>
            <div className="mt-1 text-[13px] text-bloom-subtle">
              {totalDuration} minutes
            </div>
          </div>

          <div className="flex flex-col gap-[13px] px-6 py-[22px]">
            <div className="flex justify-between">
              <span className="text-sm text-bloom-subtle">When</span>
              <span className="text-right text-sm font-semibold text-bloom-text">
                {whenLabel}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-bloom-subtle">Studio</span>
              <span className="text-right text-sm font-semibold text-bloom-text">
                {shopDetail.name}, {shopDetail.address.split(",")[0]}
              </span>
            </div>
            <div className="flex items-baseline justify-between border-t border-bloom-border pt-3.5">
              <span className="text-sm text-bloom-subtle">Total</span>
              <span className="font-display text-[28px] leading-none text-bloom-text">
                €{total.toFixed(2)}
              </span>
            </div>

            <Button
              onClick={onContinue}
              disabled={isLoading || !canContinue}
              className="mt-2 w-full rounded-full bg-bloom-accent py-6 text-base font-semibold text-bloom-bg hover:bg-bloom-accent-dark"
            >
              {isLoading ? "Loading..." : buttonLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
