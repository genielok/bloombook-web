"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PaymentField } from "@/components/ui/field";
import { IShopDetail } from "@/app/api/clients/types";

interface BookingStep4PaymentProps {
  shopDetail: IShopDetail;
  selectedServiceIds: string[];
  selectedDate: string | null;
  selectedTime: string | null;
  onBack: () => void;
  onConfirm: () => void;
}

export function BookingStep4Payment({
  onBack,
}: BookingStep4PaymentProps) {
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("09/28");
  const [cvc, setCvc] = useState("123");
  const [cardName, setCardName] = useState("Sofia Lindqvist");

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  }

  return (
    <>
      <div>
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-1.5 text-sm text-bloom-subtle transition-colors hover:text-bloom-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to your details
        </button>

        <h2 className="mb-2 font-display text-[32px] leading-tight text-bloom-text">
          Payment
        </h2>
        <p className="mb-7 text-sm text-bloom-subtle">
          Pay in full to confirm your appointment.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button className="rounded-[10px] bg-black px-4 py-[15px] text-[15px] font-semibold text-white transition-opacity hover:opacity-90">
            Apple Pay
          </button>
          <button className="rounded-[10px] border border-[#DADCE0] bg-white px-4 py-[15px] text-[15px] font-semibold text-[#3c4043] transition-colors hover:bg-bloom-soft">
            Google Pay
          </button>
          <button className="rounded-[10px] bg-[#FFC439] px-4 py-[15px] text-[15px] font-bold text-[#003087] transition-opacity hover:opacity-90">
            PayPal
          </button>
          <button className="rounded-[10px] bg-[#FFB3C7] px-4 py-[15px] text-[15px] font-bold text-[#0a0a0a] transition-opacity hover:opacity-90">
            Klarna.
          </button>
        </div>

        <div className="my-6 flex items-center gap-3.5">
          <div className="h-px flex-1 bg-bloom-border" />
          <span className="text-xs text-bloom-subtle">or pay with card</span>
          <div className="h-px flex-1 bg-bloom-border" />
        </div>

        <div className="flex flex-col gap-3.5">
          <PaymentField
            label="Card number"
            value={cardNumber}
            onChange={(value) => setCardNumber(formatCardNumber(value))}
            suffix={
              <div className="absolute right-3 top-1/2 flex -translate-y-1/2 gap-1">
                <span className="rounded-[3px] bg-[#1A1F71] px-1.5 py-1 text-[9px] font-bold text-white">
                  VISA
                </span>
                <span className="rounded-[3px] bg-[#EB001B] px-1.5 py-1 text-[9px] font-bold text-white">
                  MC
                </span>
              </div>
            }
          />

          <div className="grid grid-cols-2 gap-3.5">
            <PaymentField
              label="Expiry"
              value={expiry}
              onChange={(value) => setExpiry(formatExpiry(value))}
            />
            <PaymentField
              label="CVC"
              value={cvc}
              onChange={(value) => setCvc(value.replace(/\D/g, "").slice(0, 4))}
            />
          </div>

          <PaymentField
            label="Name on card"
            value={cardName}
            onChange={setCardName}
          />
        </div>
      </div>
    </>
  );
}
