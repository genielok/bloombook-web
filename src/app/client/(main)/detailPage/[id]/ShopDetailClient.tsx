"use client";

import { useState, useEffect } from "react";
import { BookingStepper } from "./components/BookingStepper";
import { BookingStep1Services } from "./components/BookingStep1Services";
import { BookingStep2DateTime } from "./components/BookingStep2DateTime";
import {
  BookingStep3Details,
  type CustomerDetails,
} from "./components/BookingStep3Details";
import { BookingSidebar } from "./components/BookingSidebar";
import { useRouter } from "next/navigation";
import { confirmBook, fetchShopDetail } from "@/app/api/clients/client";
import dayjs from "dayjs";
import Image from "next/image";
import { IShopDetail } from "@/app/api/clients/types";

export const ShopeDetailClient = ({ id }: { id: string }) => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [shopDetail, setShopDetail] = useState<IShopDetail>();
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    fullName: "Sofia Lindqvist",
    phone: "+49 170 555 0142",
    email: "genielok6@gmail.com",
    note: "First visit — a little nervous, please go gentle :)",
  });

  useEffect(() => {
    let ignore = false;

    void fetchShopDetail(id)
      .then(({ data }) => {
        if (!ignore) setShopDetail(data);
      })
      .catch((error: unknown) => console.error(error));

    return () => {
      ignore = true;
    };
  }, [id]);

  function toggleService(serviceId: string) {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  }

  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmBooking = async () => {
    if (!shopDetail) {
      console.error("Shop detail is not available.");
      return;
    }
    if (isConfirming) return;

    setIsConfirming(true);
    try {
      const selectedServices = shopDetail.serviceItems.filter((item) =>
        selectedServiceIds.includes(item.id),
      );
      const { data } = await confirmBook({
        salonId: shopDetail.id,
        serviceIds: selectedServiceIds,
        bookingTime: dayjs(`${selectedDate} ${selectedTime}`).valueOf(),
        servicesSnapshot: selectedServices.map((s) => ({
          id: s.id,
          name: s.name,
          price: s.price,
          durationMinutes: s.durationMinutes,
        })),
        customer: {
          name: customerDetails.fullName,
          email: customerDetails.email,
          phone: customerDetails.phone,
          note: customerDetails.note,
        },
      });
      setTimeout(() => {
        router.push(`/client/confirm?bookingId=${data.reference}`);
      }, 2000);
    } catch (error) {
      console.log(error);
      setIsConfirming(false);
    }
  };

  if (!shopDetail) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="max-w-5xl mx-auto py-4">
        <div className="mb-4">
          <BookingStepper currentStep={step} />
        </div>
        <div className="relative mb-6 h-50 overflow-hidden rounded-xs bg-[repeating-linear-gradient(45deg,#EFE0D0,#EFE0D0_16px,#E7D6C3_16px,#E7D6C3_32px)]">
          <Image
            fill
            className="object-cover"
            src={shopDetail.imgUrl}
            alt={shopDetail.name}
          />
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
          <div className="min-w-0">
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
                onDateChange={setSelectedDate}
                onTimeChange={setSelectedTime}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <BookingStep3Details
                shopDetail={shopDetail}
                selectedServiceIds={selectedServiceIds}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                customerDetails={customerDetails}
                onCustomerDetailsChange={setCustomerDetails}
                onBack={() => setStep(2)}
              />
            )}

            {/* {step === 4 && (
              <BookingStep4Payment
                shopDetail={shopDetail}
                selectedServiceIds={selectedServiceIds}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedTechnician={selectedTechnician}
                onBack={() => setStep(3)}
                onConfirm={handleConfirm}
                // bookingSummary={bookingSummary}
              />
            )} */}
          </div>

          <div>
            <BookingSidebar
              step={step}
              shopDetail={shopDetail}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              customerDetails={customerDetails}
              onConfirm={handleConfirmBooking}
              onNext={() => setStep(Math.min(step + 1, 4))}
              selectedServiceIds={selectedServiceIds}
              buttonLabel={
                step === 1
                  ? "Next: choose time"
                  : step === 2
                    ? "Continue to Detail"
                    : "Continue"
              }
              isLoading={isConfirming}
            />
          </div>
        </div>
      </div>
    </>
  );
};
