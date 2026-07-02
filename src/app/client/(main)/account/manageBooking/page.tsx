"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Copy, ExternalLink, MailIcon, PhoneCallIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  AccountBooking,
  AccountBookingsResponse,
} from "@/app/api/account/bookings/types";
import { getAccountBookings, cancelBooking } from "@/app/api/explore";
import { Button } from "@/components/ui/button";

const EMPTY_BOOKINGS: AccountBookingsResponse = {
  upcoming: [],
  history: [],
};

function formatCurrency(amount?: number) {
  return amount === undefined ? "Not provided" : `€${amount.toFixed(2)}`;
}

function getBookingDate(displayDateTime?: string) {
  return displayDateTime?.split(" · ")[0] ?? "Date not provided";
}

function findBooking(
  bookings: AccountBookingsResponse,
  bookingId: string | null,
) {
  const allBookings = [...bookings.upcoming, ...bookings.history];

  if (!bookingId) {
    return allBookings[0];
  }

  return allBookings.find(
    (booking) =>
      booking.bookingId === bookingId || booking.referenceNumber === bookingId,
  );
}

export default function ManageBookingPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [bookings, setBookings] =
    useState<AccountBookingsResponse>(EMPTY_BOOKINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadBooking() {
      try {
        const data = await getAccountBookings();

        if (!ignore) {
          setBookings(data);
        }
      } catch (error) {
        console.log("Failed to fetch account bookings:", error);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadBooking();

    return () => {
      ignore = true;
    };
  }, []);

  const booking = useMemo(
    () => findBooking(bookings, bookingId),
    [bookingId, bookings],
  );

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

function BookingDetail({ booking }: { booking: AccountBooking }) {
  const serviceItems = booking.serviceItems ?? [
    {
      id: booking.bookingId,
      name: booking.service,
      duration: booking.duration ?? 0,
      technician: booking.technician ?? "Not assigned",
      price: booking.price ?? 0,
    },
  ];
  const totalPaid = booking.totalPaid ?? booking.price;

  async function handleCopyAddress() {
    if (!booking.studioAddress) {
      return;
    }

    try {
      await navigator.clipboard.writeText(booking.studioAddress);
    } catch (error) {
      console.log("Failed to copy address:", error);
    }
  }

  const handleCancel = async () => {
    try {
      await cancelBooking({ bookingId: booking.bookingId });
    } catch (error) {
      console.log("Failed to cancel:", error);
    }
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
            <span className="rounded-pill bg-[#E6F0E8] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#5C8F6E]">
              {booking.status}
            </span>
          </div>
        </div>

        <h1 className="mt-4 font-display text-[25px] font-medium leading-none text-bloom-text md:text-[35px]">
          Reference Number{" "}
          <span className="text-bloom-accent">#{booking.referenceNumber}</span>
        </h1>

        <section className="mt-9 overflow-hidden rounded-[16px] border border-bloom-border bg-white">
          <div className="px-6 py-8 md:px-10">
            <div className="text-[13px] font-bold uppercase tracking-[0.14em] text-bloom-accent-dark">
              When
            </div>
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-baseline md:gap-7">
              <div className="font-display text-[24px] leading-none text-bloom-text">
                {getBookingDate(booking.displayDateTime)}
              </div>
              <div className="text-[15px] text-bloom-subtle">
                {booking.timeRange ?? booking.displayDateTime}
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
                  {booking.studioName}, {booking.studioArea}
                </div>
                <div className="mt-2 flex items-center gap-1 text-[15px] font-semibold text-bloom-accent-dark">
                  {booking.studioAddress}
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
                <div className="mt-2 text-[15px]  text-bloom-subtle">
                  <div className="flex align-middle">
                    <PhoneCallIcon size={15} className="mr-2 h-6 " />
                    {booking.studioPhone}
                  </div>
                  <div className="flex">
                    <MailIcon size={15} className="mr-2 h-6 " />
                    {booking.studioEmail}
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
              {serviceItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-6"
                >
                  <div>
                    <div className="text-[15px] font-bold text-bloom-text">
                      {item.name}
                    </div>
                    <div className="mt-1 text-[13px] font-semibold text-bloom-subtle">
                      {item.duration} min · with {item.technician}
                    </div>
                  </div>
                  <div className="text-[15px] font-bold text-bloom-text">
                    {formatCurrency(item.price)}
                  </div>
                </div>
              ))}

              {booking.promoLabel && booking.promoDiscount !== undefined && (
                <div className="flex items-center justify-between gap-6 text-[15px] font-bold text-bloom-success">
                  <span>{booking.promoLabel}</span>
                  <span>-{formatCurrency(booking.promoDiscount)}</span>
                </div>
              )}
            </div>

            <div className="mt-7 border-t border-bloom-border pt-7">
              <div className="flex items-end justify-between gap-6">
                <div className="text-[14px] font-bold text-bloom-subtle">
                  Total paid · {booking.paymentMethod} ••
                  {booking.paymentLast4}
                </div>
                <div className="font-display text-[26px] leading-none text-bloom-text">
                  {formatCurrency(totalPaid)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleCancel}
            className="rounded-full bg-bloom-text px-9 py-7 text-[17px] font-bold text-bloom-bg hover:bg-bloom-text/90"
          >
            Cancel booking
          </Button>
        </div>

        <p className="mt-5 text-[15px] font-semibold text-bloom-subtle">
          Free to reschedule or cancel up to{" "}
          <span className="font-bold text-bloom-text">24 hours before</span>{" "}
          your appointment.
        </p>
      </div>
    </div>
  );
}
