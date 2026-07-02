"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { PaymentField } from "@/components/ui/field";
import type { IShopDetail } from "@/app/api/shopDetail/types";

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  note: string;
}

interface BookingStep3DetailsProps {
  shopDetail: IShopDetail;
  selectedServiceIds: string[];
  selectedDate: string | null;
  selectedTime: string | null;
  selectedTechnician: string;
  customerDetails: CustomerDetails;
  onCustomerDetailsChange: (details: CustomerDetails) => void;
  onBack: () => void;
  onNext: () => void;
}

const TECHNICIAN_LABELS: Record<string, string> = {
  any: "No preference",
  lena: "Lena",
  mara: "Mara",
};

export function BookingStep3Details({
  shopDetail,
  selectedServiceIds,
  selectedDate,
  selectedTime,
  selectedTechnician,
  customerDetails,
  onCustomerDetailsChange,
  onBack,
  onNext,
}: BookingStep3DetailsProps) {
  const allItems = shopDetail.services.flatMap((c) => c.items);
  const selectedServices = allItems.filter((item) =>
    selectedServiceIds.includes(item.id),
  );
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce(
    (sum, s) => sum + s.duration,
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
  const technicianLabel =
    TECHNICIAN_LABELS[selectedTechnician] ?? selectedTechnician;

  const canContinue =
    customerDetails.fullName.trim() &&
    customerDetails.phone.trim() &&
    customerDetails.email.trim();

  function updateDetails(key: keyof CustomerDetails, value: string) {
    onCustomerDetailsChange({
      ...customerDetails,
      [key]: value,
    });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
      <div>
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-1.5 text-sm text-bloom-subtle transition-colors hover:text-bloom-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to date & time
        </button>

        <h2 className="mb-2 font-display text-[32px] leading-tight text-bloom-text">
          Your details
        </h2>
        <p className="mb-7 text-sm text-bloom-subtle">
          So the studio knows who&apos;s coming in. No account needed.
        </p>

        <div className="max-w-[560px]">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <PaymentField
              label="Full name"
              value={customerDetails.fullName}
              onChange={(value) => updateDetails("fullName", value)}
            />
            <PaymentField
              label="Phone"
              value={customerDetails.phone}
              onChange={(value) => updateDetails("phone", value)}
            />
          </div>

          <div className="mt-4">
            <PaymentField
              label="Email"
              value={customerDetails.email}
              onChange={(value) => updateDetails("email", value)}
            />
          </div>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs text-bloom-subtle">
              Note for the studio{" "}
              <span className="text-[#C3B6A6]">(optional)</span>
            </span>
            <textarea
              value={customerDetails.note}
              onChange={(event) => updateDetails("note", event.target.value)}
              className="h-[84px] w-full resize-none rounded-[10px] border border-bloom-border bg-white px-4 py-[15px] text-[15px] text-bloom-text outline-none focus:border-bloom-accent focus:ring-3 focus:ring-bloom-accent/20"
            />
          </label>
        </div>
      </div>

      <div>
        <div className="sticky top-6 overflow-hidden rounded-panel border border-bloom-border bg-white">
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
              <span className="text-sm text-bloom-subtle">Technician</span>
              <span className="text-right text-sm font-semibold text-bloom-text">
                {technicianLabel}
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
                €{totalPrice.toFixed(2)}
              </span>
            </div>

            <Button
              onClick={onNext}
              disabled={!canContinue}
              className="mt-2 w-full rounded-full bg-bloom-accent py-6 text-base font-semibold text-bloom-bg hover:bg-bloom-accent-dark"
            >
              Continue to payment
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
