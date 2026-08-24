"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Copy,
  ExternalLink,
  MailIcon,
  PhoneCallIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { fetchBookingDetail, cancelBooking } from "@/app/api/clients/client";
import { Button } from "@/components/ui/button";
import { Booking } from "@/app/api/clients/types";
import dayjs from "dayjs";
import { statusStyles } from "../components/bookingCard";
import { AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Toast from "@/components/Toast";

function formatCurrency(amount?: number) {
  return amount === undefined ? "Not provided" : `€${amount.toFixed(2)}`;
}

export default function ManageBookingPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<Booking>();
  const [isLoading, setIsLoading] = useState(Boolean(bookingId));

  useEffect(() => {
    if (!bookingId) return;
    let ignore = false;

    void fetchBookingDetail(bookingId)
      .then(({ data }) => {
        if (!ignore) setBooking(data);
      })
      .catch((error: unknown) => {
        console.log("Failed to fetch account bookings:", error);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="px-5 py-8 md:px-8 lg:px-12 lg:py-10">
        <div className="rounded-[12px] border border-bloom-border bg-white p-5 text-sm text-bloom-subtle">
          Loading booking...
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="px-5 py-8 md:px-8 lg:px-12 lg:py-10">
        <div className="rounded-[12px] border border-bloom-border bg-white p-6">
          <h1 className="font-display text-[32px] text-bloom-text">
            Booking not found
          </h1>
          <p className="mt-2 text-sm text-bloom-subtle">
            We could not find that booking in your account.
          </p>
          <Button asChild className="mt-5">
            <Link href="/client/account/booking">Back to bookings</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <BookingDetail booking={booking} />;
}

function BookingDetail({ booking }: { booking: Booking }) {
  const router = useRouter();

  const [showSuccess, setShowSuccess] = useState(false);

  const { salon, servicesSnapshot } = booking;

  async function handleCopyAddress() {
    if (!salon.address) {
      return;
    }

    try {
      await navigator.clipboard.writeText(salon.address);
    } catch (error) {
      console.log("Failed to copy address:", error);
    }
  }

  const handleCancel = async () => {
    try {
      await cancelBooking({ bookingId: booking.id });
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/client/explore");
      }, 1400);
    } catch (error) {
      console.log("Failed to cancel:", error);
    }
  };

  const handleSchedule = () => {
    const params = {
      bookingId: booking.id,
      salonId: booking.salonId,
      selectedServiceIds: booking.serviceIds,
    };
    router.push(
      `/client/account/reschedule?booking=${encodeURIComponent(JSON.stringify(params))}`,
    );
  };

  return (
    <div className="px-5 py-8 md:px-8 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-[780px]">
        <div className="flex justify-between ">
          <Link
            href="/client/account/booking"
            className="text-[15px] font-semibold text-bloom-accent-dark"
          >
            ← Bookings
          </Link>
          <div className="flex items-center gap-4">
            <span
              className={`rounded-pill px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] ${statusStyles[booking.status] ?? "bg-gray-100 text-gray-700"} `}
            >
              {booking.status}
            </span>
          </div>
        </div>

        <h1 className="mt-4 font-display text-[25px] font-medium leading-none text-bloom-text md:text-[35px]">
          Reference Number{" "}
          <span className="text-bloom-accent">#{booking.reference}</span>
        </h1>

        <section className="mt-9 overflow-hidden rounded-[16px] border border-bloom-border bg-white">
          <div className="px-6 py-8 md:px-10">
            <div className="text-[13px] font-bold uppercase tracking-[0.14em] text-bloom-accent-dark">
              When
            </div>
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-baseline md:gap-7">
              <div className="font-display text-[24px] leading-none text-bloom-text">
                {dayjs(booking.createdAt).format("YYYY-MM-DD HH:mm")}
              </div>
              <div className="text-[15px] text-bloom-subtle">
                {booking.startTime} - {booking.endTime}
              </div>
            </div>
          </div>

          <div className="border-t border-bloom-border px-6 py-8 md:px-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-[13px] font-bold uppercase tracking-[0.14em] text-bloom-accent-dark">
                  Where
                </div>
                <div className="mt-4 text-[19px] font-bold text-bloom-text">
                  {salon.name}, {salon.address}
                </div>
                <div className="mt-2 flex items-center gap-1 text-[15px] font-semibold text-bloom-accent-dark">
                  {salon.address}
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
                <div className="mt-2 text-[15px]  text-bloom-subtle">
                  <div className="flex align-middle">
                    <PhoneCallIcon size={15} className="mr-2 h-6 " />
                    {salon.phone}
                  </div>
                  <div className="flex">
                    <MailIcon size={15} className="mr-2 h-6 " />
                    {salon.email}
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyAddress}
                className="w-fit rounded-full border-bloom-border px-5 py-5 text-[13px] font-bold"
              >
                <Copy className="mr-2 h-3 w-4" />
                Copy address
              </Button>
            </div>
          </div>

          <div className="border-t border-bloom-border px-6 py-8 md:px-10">
            <div className="text-[13px] font-bold uppercase tracking-[0.14em] text-bloom-accent-dark">
              Services
            </div>

            <div className="mt-5 space-y-5">
              {servicesSnapshot.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-6"
                >
                  <div>
                    <div className="text-[15px] font-bold text-bloom-text">
                      {item.name}
                    </div>
                    <div className="mt-1 text-[13px] font-semibold text-bloom-subtle">
                      {item.durationMinutes} min
                    </div>
                  </div>
                  <div className="text-[15px] font-bold text-bloom-text">
                    {formatCurrency(item.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {booking.status !== "cancelled" && (
          <>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleSchedule}
                className="rounded-full  px-9 py-7 text-[17px] font-bold  "
              >
                Reschedule
              </Button>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button
                    variant="outline"
                    className="rounded-full bg-bloom-text px-9 py-7 text-[17px] font-bold text-bloom-bg hover:bg-bloom-text/90"
                  >
                    Cancel booking
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDescription>
                    Are you sure you want to cancel this booking?
                  </AlertDescription>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div>
              <p className="mt-5 text-[15px] font-semibold text-bloom-subtle">
                Free to reschedule or cancel up to{" "}
                <span className="font-bold text-bloom-text">
                  24 hours before
                </span>{" "}
                your appointment.
              </p>
            </div>
          </>
        )}
      </div>
      <Toast
        visible={showSuccess}
        type="success"
        message="Booking updated successfully"
        onClose={() => setShowSuccess(false)}
        duration={1800}
      />
    </div>
  );
}
