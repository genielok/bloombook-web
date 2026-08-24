"use client";

import { IShopDetail } from "@/app/api/clients/types";
import DateTimeSelector from "@/components/DateTimeSelector";

interface BookingStep2DateTimeProps {
  shopDetail: IShopDetail;
  selectedServiceIds: string[];
  selectedDate: string | null;
  selectedTime: string | null;
  onDateChange: (dateId: string) => void;
  onTimeChange: (time: string) => void;
  onBack: () => void;
}

export function BookingStep2DateTime({
  shopDetail,
  selectedServiceIds,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  onBack,
}: BookingStep2DateTimeProps) {
  return (
    <div className="min-w-0">
      <DateTimeSelector
        shopId={shopDetail.id}
        selectedServiceIds={selectedServiceIds}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onDateChange={onDateChange}
        onTimeChange={onTimeChange}
        onBack={onBack}
      />
    </div>
  );
}
