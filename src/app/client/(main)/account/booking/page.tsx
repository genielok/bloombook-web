"use client";
import {
  AccountBooking,
  AccountBookingsResponse,
} from "@/app/api/account/bookings/types";
import { getAccountBookings } from "@/app/api/explore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { BookingCard } from "../components/bookingCard";

const BOOKING_TABS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "history", label: "History" },
] as const;

type BookingTab = (typeof BOOKING_TABS)[number]["value"];

const EMPTY_BOOKINGS: AccountBookingsResponse = {
  upcoming: [],
  history: [],
};

function BookingList({
  bookings,
  isLoading,
  activeTab,
}: {
  bookings: AccountBooking[];
  isLoading: boolean;
  activeTab: BookingTab;
}) {
  if (isLoading) {
    return (
      <div className="rounded-[12px] border border-bloom-border bg-white p-5 text-sm text-bloom-subtle">
        Loading bookings...
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-[12px] border border-bloom-border bg-white p-5 text-sm text-bloom-subtle">
        No bookings found.
      </div>
    );
  }

  return bookings.map((booking, index) => (
    <BookingCard
      key={booking.bookingId}
      booking={booking}
      index={index}
      activeTab={activeTab}
    />
  ));
}

export default function BookingPage() {
  const [bookings, setBookings] =
    useState<AccountBookingsResponse>(EMPTY_BOOKINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadBookings() {
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

    void loadBookings();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="px-5 py-8 md:px-8 lg:px-12 lg:py-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 text-[13px] uppercase tracking-[0.14em] text-bloom-accent-dark">
            My account
          </div>
          <h1 className="font-display text-[38px] font-medium leading-none md:text-[40px]">
            Bookings
          </h1>
        </div>
      </div>

      <Tabs className="mt-2" defaultValue={BOOKING_TABS[0].value}>
        <TabsList>
          {BOOKING_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label} ({bookings[tab.value].length})
            </TabsTrigger>
          ))}
        </TabsList>
        {BOOKING_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="mt-[26px] flex flex-col gap-3">
              <BookingList
                bookings={bookings[tab.value]}
                isLoading={isLoading}
                activeTab={tab.value}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
