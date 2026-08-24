"use client";

import { rescheduleBooking } from "@/app/api/clients/client";
import DateTimeSelector from "@/components/DateTimeSelector";
import Toast from "@/components/Toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type RescheduleBooking = {
  bookingId: string;
  salonId: string;
  selectedServiceIds: string[];
};

const ReschedulePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingParam = searchParams.get("booking"); // 已 encodeURIComponent(JSON.stringify(booking))

  const booking = useMemo<RescheduleBooking | undefined>(() => {
    if (!bookingParam) return undefined;

    try {
      return JSON.parse(decodeURIComponent(bookingParam)) as RescheduleBooking;
    } catch (error) {
      console.error("Invalid booking param", error);
      return undefined;
    }
  }, [bookingParam]);
  const [seletedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = async () => {
    if (!booking) return;
    try {
      const params = {
        id: booking.bookingId,
        bookingTime: new Date(`${seletedDate} ${selectedTime}`).getTime(),
      };
      const { data } = await rescheduleBooking(params);

      setShowSuccess(true);
      setTimeout(() => {
        router.push(`/client/confirm?bookingId=${data.reference}`);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  if (!booking) {
    return <div>No Found</div>;
  }

  return (
    <div className="p-4">
      <DateTimeSelector
        shopId={booking.salonId}
        selectedServiceIds={booking.selectedServiceIds}
        selectedDate={seletedDate}
        selectedTime={selectedTime}
        onDateChange={setSelectedDate}
        onTimeChange={setSelectedTime}
      ></DateTimeSelector>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button className=" mt-8 rounded-full bg-bloom-text px-7 py-6 text-base font-semibold text-bloom-bg hover:bg-bloom-text/90">
            Confirm
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure change to this time?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>{" "}
        </AlertDialogContent>
      </AlertDialog>
      <Toast
        visible={showSuccess}
        type="success"
        message="Booking updated successfully"
        onClose={() => setShowSuccess(false)}
        duration={1800}
      />
    </div>
  );
};

export default ReschedulePage;
