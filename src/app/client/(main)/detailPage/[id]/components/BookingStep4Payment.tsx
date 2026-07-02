"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { IShopDetail } from "@/app/api/shopDetail/types";
import dayjs from "dayjs";
import { validPromo } from "@/app/api/explore";
import { PaymentField } from "@/components/ui/field";

interface BookingStep4PaymentProps {
  shopDetail: IShopDetail;
  selectedServiceIds: string[];
  selectedDate: string | null;
  selectedTime: string | null;
  selectedTechnician: string;
  onBack: () => void;
  onConfirm: () => void;
}

const TECHNICIAN_LABELS: Record<string, string> = {
  any: "No preference",
  lena: "Lena",
  mara: "Mara",
};

export function BookingStep4Payment({
  shopDetail,
  selectedServiceIds,
  selectedDate,
  selectedTime,
  selectedTechnician,
  onBack,
  onConfirm,
}: BookingStep4PaymentProps) {
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("09/28");
  const [cvc, setCvc] = useState("123");
  const [cardName, setCardName] = useState("Sofia Lindqvist");
  const [promoCode, setPromoCode] = useState("PETAL10");
  const [promoApplied, setPromoApplied] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const allItems = shopDetail.services.flatMap((c) => c.items);
  const selectedServices = allItems.filter((item) =>
    selectedServiceIds.includes(item.id),
  );
  const subtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;
  const totalDuration = selectedServices.reduce(
    (sum, s) => sum + s.duration,
    0,
  );

  const bookingTitle =
    selectedServices.length === 1
      ? selectedServices[0].name
      : `${selectedServices.length} services`;
  const appointmentSummary = [
    selectedDate ? dayjs(selectedDate).format("ddd DD MMM") : null,
    selectedTime,
    selectedTechnician
      ? `with ${TECHNICIAN_LABELS[selectedTechnician] ?? selectedTechnician}`
      : null,
    shopDetail.name,
  ]
    .filter(Boolean)
    .join(" · ");

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  }

  const [isPromoValid, setIsPromoValid] = useState(true);
  async function handleApplyPromo() {
    try {
      const { available } = await validPromo(promoCode);
      if (available) {
        setPromoApplied(true);
      }
      setIsPromoValid(available);
    } catch (error) {
      console.log(error);
    }
  }

  function handleRemovePromo() {
    setPromoApplied(false);
    setPromoCode("");
  }

  async function handleConfirm() {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsProcessing(false);
    onConfirm();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
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

      <div>
        <div className="overflow-hidden rounded-panel border border-bloom-border bg-white">
          <div className="border-b border-bloom-border bg-bloom-soft px-6 py-[22px]">
            <h3 className="font-display text-2xl leading-tight text-bloom-text">
              {bookingTitle}
            </h3>
            <div className="mt-1 text-[13px] text-bloom-subtle">
              {appointmentSummary || `${totalDuration} minutes`}
            </div>
          </div>

          <div className="px-6 py-[22px]">
            <div className="mb-[18px]">
              <div className="flex gap-2">
                <div
                  className={`flex flex-1 items-center justify-between rounded-[10px] border  bg-white px-[15px] py-[13px] text-[15px] ${isPromoValid ? "border-bloom-border" : "border-red-600"}`}
                >
                  <Input
                    value={String(promoCode).toUpperCase()}
                    disabled={promoApplied}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code"
                    className="h-auto !border-0 bg-transparent p-0 font-semibold tracking-[0.05em] shadow-none focus-visible:!ring-0"
                  />
                  {promoApplied && (
                    <span className="shrink-0 text-xs font-semibold text-bloom-success">
                      ✓ Applied
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={promoApplied ? handleRemovePromo : handleApplyPromo}
                  disabled={!promoApplied && !promoCode}
                  className="h-auto rounded-[10px] border-bloom-border bg-transparent px-[18px] text-sm font-semibold text-bloom-subtle hover:bg-bloom-soft"
                >
                  {promoApplied ? "Remove" : "Apply"}
                </Button>
              </div>
              {!isPromoValid && (
                <span className="shrink-0 text-xs font-semibold text-red-600">
                  Invaliable Promo
                </span>
              )}
            </div>
            <div className="flex flex-col gap-[11px]">
              {selectedServices.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between text-sm text-bloom-subtle"
                >
                  <span>{service.name}</span>
                  <span>€{service.price.toFixed(2)}</span>
                </div>
              ))}

              {promoApplied && (
                <div className="flex justify-between text-sm text-bloom-success">
                  <span>Promo · {promoCode || "PETAL10"} (−10%)</span>
                  <span>−€{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex items-baseline justify-between border-t border-bloom-border pt-[13px]">
                <span className="text-sm text-bloom-subtle">
                  Total due today
                </span>
                <span className="font-display text-[30px] leading-none text-bloom-text">
                  €{total.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleConfirm}
              disabled={isProcessing || !cardName}
              className="mt-5 w-full rounded-full bg-bloom-accent py-6 text-base font-semibold text-bloom-bg hover:bg-bloom-accent-dark"
            >
              {isProcessing
                ? "Processing…"
                : `Pay €${total.toFixed(2)} & confirm`}
            </Button>

            <div className="mt-3 text-center text-xs text-bloom-subtle">
              By confirming you agree to the studio&apos;s cancellation policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
