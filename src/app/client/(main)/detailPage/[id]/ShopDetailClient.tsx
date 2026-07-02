"use client";

import { useState } from "react";
import type { IShopDetail } from "@/app/api/shopDetail/types";
import { BookingStepper } from "./components/BookingStepper";
import { BookingStep1Services } from "./components/BookingStep1Services";
import { BookingStep2DateTime } from "./components/BookingStep2DateTime";
import {
  BookingStep3Details,
  type CustomerDetails,
} from "./components/BookingStep3Details";
import { BookingStep4Payment } from "./components/BookingStep4Payment";
import { useRouter } from "next/navigation";
import { confirmBook } from "@/app/api/explore";

export const ShopeDetailClient = ({
  shopDetail,
}: {
  shopDetail: IShopDetail;
}) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedTechnician, setSelectedTechnician] = useState(
    shopDetail.defaultBooking.technician.toLowerCase(),
  );
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    fullName: "Sofia Lindqvist",
    phone: "+49 170 555 0142",
    email: "sofia.l@email.com",
    note: "First visit — a little nervous, please go gentle :)",
  });
  const handleConfirm = async () => {
    try {
      const data = await confirmBook({
        selectedDate,
        selectedTime,
        selectedTechnician,
        selectedServiceIds,
        customerDetails,
      });
      if (data.status) {
        router.push(`/client/confirm?bookingId=${data.bookingId}`);
      }
    } catch (error) {
      console.log(error);
    }
    // setIsConfirmed(true)
    //   const allItems = shopDetail.services.flatMap((c) => c.items);
    // const selectedServices = allItems.filter((item) =>
    //   selectedServiceIds.includes(item.id),
    // );
    // const total = selectedServices.reduce((sum, s) => sum + s.price, 0);
  };

  function toggleService(serviceId: string) {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto py-8">
        <div className="mb-4">
          <BookingStepper currentStep={step} />
        </div>

        {step === 1 && (
          <BookingStep1Services
            shopDetail={shopDetail}
            selectedServiceIds={selectedServiceIds}
            onToggleService={toggleService}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <BookingStep2DateTime
            shopDetail={shopDetail}
            selectedServiceIds={selectedServiceIds}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedTechnician={selectedTechnician}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            onTechnicianChange={setSelectedTechnician}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <BookingStep3Details
            shopDetail={shopDetail}
            selectedServiceIds={selectedServiceIds}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedTechnician={selectedTechnician}
            customerDetails={customerDetails}
            onCustomerDetailsChange={setCustomerDetails}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <BookingStep4Payment
            shopDetail={shopDetail}
            selectedServiceIds={selectedServiceIds}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedTechnician={selectedTechnician}
            onBack={() => setStep(3)}
            onConfirm={handleConfirm}
          />
        )}
      </div>
    </>
  );
};
