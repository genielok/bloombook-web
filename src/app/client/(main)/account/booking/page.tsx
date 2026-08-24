"use client";

import { getMyBookings } from "@/app/api/clients/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { BookingCard } from "../components/bookingCard";
import { Booking } from "@/app/api/clients/types";

const BOOKING_TABS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "history", label: "History" },
] as const;

type BookingTab = (typeof BOOKING_TABS)[number]["value"];

function BookingList({
  bookings,
  isLoading,
  activeTab,
}: {
  bookings: Booking[];
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

  return bookings.map((booking) => (
    <BookingCard
      key={booking.id}
      booking={booking}
      activeTab={activeTab}
    />
  ));
}

export default function BookingPage() {
  const [comingBookings, setComingBookings] = useState<Booking[]>([]);
  const [historyBookings, setHistoryBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    void Promise.all([getMyBookings("upcoming"), getMyBookings("history")])
      .then(([upcoming, history]) => {
        if (ignore) return;
        setComingBookings(upcoming.data);
        setHistoryBookings(history.data);
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
              {tab.label} (
              {tab.label === "History"
                ? historyBookings.length
                : comingBookings?.length}
              )
            </TabsTrigger>
          ))}
        </TabsList>
        {BOOKING_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="mt-[26px] flex flex-col gap-3">
              <BookingList
                bookings={
                  tab.label === "History" ? historyBookings : comingBookings
                }
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
