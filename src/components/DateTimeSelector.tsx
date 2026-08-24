"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchAvalibleSlots } from "@/app/api/clients/client";
import dayjs from "dayjs";
import { ISlot } from "@/app/api/clients/types";

interface DateTimeSelectorProps {
  shopId: string;
  selectedServiceIds: string[];
  selectedDate: string | null;
  selectedTime: string | null;
  onDateChange: (dateId: string) => void;
  onTimeChange: (time: string) => void;
  onBack?: () => void;
  dateTitle?: string;
  timeTitle?: string;
}

export function DateTimeSelector({
  shopId,
  selectedServiceIds,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  onBack,
  dateTitle = "Choose a date",
  timeTitle = "Available times",
}: DateTimeSelectorProps) {
  const [dateInfo, setDateInfo] = useState<ISlot[]>([]);
  const slotsInfo = selectedDate
    ? (dateInfo.find((item) => item.date === selectedDate)?.availableTimes ?? [])
    : [];

  const handleDateChange = (slot: ISlot) => {
    onDateChange(slot.date);
  };

  useEffect(() => {
    let ignore = false;

    async function loadDateInfo() {
      try {
        const date = new Date().getTime();
        const { data } = await fetchAvalibleSlots({
          salonId: shopId,
          startDate: date,
          serviceIds: selectedServiceIds,
        });

        if (!ignore) {
          setDateInfo(data.days);
        }
      } catch (error) {
        console.log(error);
      }
    }

    void loadDateInfo();

    return () => {
      ignore = true;
    };
  }, [shopId, selectedServiceIds]);

  return (
    <div className="min-w-0">
      <Button className="text-bloom-subtle" onClick={onBack} variant={"link"}>
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div>
        <h2 className="font-display text-[26px] leading-tight text-bloom-text mb-4">
          {dateTitle}
        </h2>
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
          {dateInfo.map((item) => {
            const isSelected = selectedDate === item.date;
            return (
              <button
                key={item.date}
                disabled={!item.hasAvailability}
                onClick={() => handleDateChange(item)}
                className={`flex-1 min-w-[76px] rounded-card border py-3.5 text-center transition-colors ${
                  !item.hasAvailability
                    ? "border-bloom-border bg-bloom-soft opacity-45 cursor-not-allowed"
                    : isSelected
                      ? "border-[1.6px] border-bloom-accent bg-bloom-bg"
                      : "border-bloom-border bg-bloom-soft hover:border-bloom-accent/60"
                }`}
              >
                <span
                  className={`block text-xs ${
                    isSelected ? "text-bloom-accent-dark" : "text-bloom-subtle"
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

      <div className="mt-9">
        <h2 className="font-display text-[26px] leading-tight text-bloom-text mb-4">
          {timeTitle}
        </h2>
        {!selectedDate ? (
          <p className="text-sm text-bloom-subtle">
            Please select a date first
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {slotsInfo.map((slot) => {
              const isSelected = selectedTime === slot;
              return (
                <button
                  key={slot}
                  onClick={() => onTimeChange(slot)}
                  className={`rounded-[10px] py-3.5 text-center text-[15px]   ${
                    isSelected
                      ? "border border-bloom-accent bg-bloom-accent font-semibold text-bloom-bg"
                      : "border border-bloom-border bg-transparent font-semibold text-bloom-text hover:border-bloom-accent/60"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default DateTimeSelector;
