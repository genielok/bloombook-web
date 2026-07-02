"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IShopDetail, ISlot, ITimeSlot } from "@/app/api/shopDetail/types";
import { useEffect, useState } from "react";
import { fetchAvalibleSlots } from "@/app/api/explore";
import dayjs from "dayjs";

interface BookingStep2DateTimeProps {
  shopDetail: IShopDetail;
  selectedServiceIds: string[];
  selectedDate: string | null;
  selectedTime: string | null;
  selectedTechnician: string;
  onDateChange: (dateId: string) => void;
  onTimeChange: (time: string) => void;
  onTechnicianChange: (techId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BookingStep2DateTime({
  shopDetail,
  selectedServiceIds,
  selectedDate,
  selectedTime,
  selectedTechnician,
  onDateChange,
  onTimeChange,
  onTechnicianChange,
  onNext,
  onBack,
}: BookingStep2DateTimeProps) {
  const [dateInfo, setDateInfo] = useState<ISlot[]>([]);
  const [slotsInfo, setSlotsInfo] = useState<ITimeSlot[]>([]);
  const allItems = shopDetail.services.flatMap((c) => c.items);
  const selectedServices = allItems.filter((item) =>
    selectedServiceIds.includes(item.id),
  );
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce(
    (sum, s) => sum + s.duration,
    0,
  );

  const Technicians = shopDetail?.techniCians
    ? [
        { id: "0", name: "Any", label: "", avatar: "pattern" },
        ...shopDetail?.techniCians,
      ]
    : [];

  const canContinue = !!selectedDate && !!selectedTime;

  const selectedTechnicianInfo = Technicians?.find(
    (tech) => tech.id === selectedTechnician,
  );
  const bookingTitle =
    selectedServices.length === 1
      ? selectedServices[0].name
      : `${selectedServices.length} services`;

  const handleDateChange = (slot: ISlot) => {
    onDateChange(slot.date);
    setSlotsInfo(slot.timeSlot);
  };

  useEffect(() => {
    let ignore = false;

    async function loadDateInfo() {
      try {
        const date = new Date().toDateString();
        const data = await fetchAvalibleSlots({
          shopId: shopDetail.id,
          startDate: date,
        });

        if (!ignore) {
          setDateInfo(data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    void loadDateInfo();

    return () => {
      ignore = true;
    };
  }, [shopDetail.id]);

  const whenLabel =
    selectedDate && selectedTime
      ? `${dayjs(selectedDate).format("ddd DD MMM")} · ${selectedTime}`
      : "Select date & time";

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
      {/* Main content */}
      <div className="min-w-0">
        <Button className="text-bloom-subtle" onClick={onBack} variant={"link"}>
          <ArrowLeft className="w-4 h-4" />
          Back to services
        </Button>
        {/* Date selection */}
        <div>
          <h2 className="font-display text-[26px] leading-tight text-bloom-text mb-4">
            Choose a date
          </h2>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
            {dateInfo.map((item) => {
              const isSelected = selectedDate === item.date;
              return (
                <button
                  key={item.date}
                  disabled={!item.available}
                  onClick={() => handleDateChange(item)}
                  className={`flex-1 min-w-[76px] rounded-card border py-3.5 text-center transition-colors ${
                    !item.available
                      ? "border-bloom-border bg-bloom-soft opacity-45 cursor-not-allowed"
                      : isSelected
                        ? "border-[1.6px] border-bloom-accent bg-bloom-bg"
                        : "border-bloom-border bg-bloom-soft hover:border-bloom-accent/60"
                  }`}
                >
                  <span
                    className={`block text-xs ${
                      isSelected
                        ? "text-bloom-accent-dark"
                        : "text-bloom-subtle"
                    }`}
                  >
                    {dayjs(item.date).format("ddd")}
                  </span>
                  <span
                    className={`mt-0.5 block font-display text-2xl leading-none ${
                      isSelected ? "text-bloom-accent-dark" : "text-bloom-text"
                    }`}
                  >
                    {dayjs(item.date).format("DD")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div className="mt-9">
          <h2 className="font-display text-[26px] leading-tight text-bloom-text mb-4">
            Available times
          </h2>
          {!selectedDate ? (
            <p className="text-sm text-bloom-subtle">
              Please select a date first
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
              {slotsInfo.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => onTimeChange(slot.time)}
                    className={`rounded-[10px] py-3.5 text-center text-[15px] transition-colors ${
                      !slot.available
                        ? "border border-bloom-border text-[#C3B6A6] cursor-not-allowed line-through"
                        : isSelected
                          ? "border border-bloom-accent bg-bloom-accent font-semibold text-bloom-bg"
                          : "border border-bloom-border bg-transparent font-semibold text-bloom-text hover:border-bloom-accent/60"
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Technician selection */}
        <div className="mt-9">
          <h2 className="font-display text-[26px] leading-tight text-bloom-text mb-4">
            Technician
          </h2>
          <div className="flex max-w-[460px] gap-3">
            {Technicians.map((tech) => {
              const isSelected = selectedTechnician === tech.id;
              return (
                <button
                  key={tech.id}
                  onClick={() => onTechnicianChange(tech.id)}
                  className={`flex flex-1 flex-col items-center gap-2 rounded-card border py-4 transition-colors ${
                    isSelected
                      ? "border-[1.6px] border-bloom-accent bg-bloom-bg"
                      : "border-bloom-border bg-bloom-soft hover:border-bloom-accent/60"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-[13px] ${
                      tech.avatar === "plain"
                        ? "bg-[#EDE3D7] text-[#A08C78]"
                        : "bg-[repeating-linear-gradient(45deg,#E7D6C3,#E7D6C3_5px,#DCC8B2_5px,#DCC8B2_10px)]"
                    }`}
                  >
                    {tech.label}
                  </div>
                  <span
                    className={`text-[13px] ${
                      isSelected
                        ? "font-semibold text-bloom-accent-dark"
                        : "text-bloom-text"
                    }`}
                  >
                    {tech.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky sidebar summary */}
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
                <span className="text-sm text-bloom-subtle">Technician</span>
                <span className="text-right text-sm font-semibold text-bloom-text">
                  {selectedTechnicianInfo?.name ?? selectedTechnician}
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
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <div className="text-center text-xs text-bloom-subtle">
                🔒 You won&apos;t be charged until you confirm
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
