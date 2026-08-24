"use client";

import { ArrowLeft } from "lucide-react";
import { PaymentField } from "@/components/ui/field";
import { IShopDetail } from "@/app/api/clients/types";

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
  customerDetails: CustomerDetails;
  onCustomerDetailsChange: (details: CustomerDetails) => void;
  onBack: () => void;
}

export function BookingStep3Details({
  customerDetails,
  onCustomerDetailsChange,
  onBack,
}: BookingStep3DetailsProps) {
  function updateDetails(key: keyof CustomerDetails, value: string) {
    onCustomerDetailsChange({
      ...customerDetails,
      [key]: value,
    });
  }

  return (
    <div className="min-w-0">
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
            onChange={(v) => updateDetails("fullName", v)}
          />
          <PaymentField
            label="Phone"
            value={customerDetails.phone}
            onChange={(v) => updateDetails("phone", v)}
          />
        </div>

        <div className="mt-4">
          <PaymentField
            label="Email"
            value={customerDetails.email}
            onChange={(v) => updateDetails("email", v)}
          />
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs text-bloom-subtle">
            Note for the studio{" "}
            <span className="text-[#C3B6A6]">(optional)</span>
          </span>
          <textarea
            value={customerDetails.note}
            onChange={(e) => updateDetails("note", e.target.value)}
            className="h-[84px] w-full resize-none rounded-[10px] border border-bloom-border bg-white px-4 py-[15px] text-[15px] text-bloom-text outline-none focus:border-bloom-accent focus:ring-3 focus:ring-bloom-accent/20"
          />
        </label>
      </div>
    </div>
  );
}
