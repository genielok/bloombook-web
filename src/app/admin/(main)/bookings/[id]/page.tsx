"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { getBookingDetail } from "@/app/api/admins/admin";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { type AdminBooking } from "../../components/bookings-data";
import { BookingForm } from "./components/BookingForm";

export default function AdminBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<AdminBooking>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchBooking = async (bookingId: string) => {
    try {
      setIsLoading(true);
      const { data } = await getBookingDetail(bookingId);
      setBooking(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    id && fetchBooking(id);
  }, [id]);

  if (isLoading) {
    return <BookingMessage message="Loading booking…" />;
  }

  if (!booking) {
    return <BookingMessage message={"Booking not found."} />;
  }

  return <BookingForm key={booking.id} booking={booking} />;
}

function BookingMessage({ message }: { message: string }) {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <Button
        asChild
        variant="link"
        className="mb-4 h-auto gap-1.5 px-0 text-[13px] font-semibold text-bloom-accent-dark"
      >
        <Link href="/admin/bookings">
          <ArrowLeft className="size-3.5" /> All bookings
        </Link>
      </Button>
      <Card className="border-bloom-border bg-white shadow-none">
        <CardContent className="py-12 text-center text-sm text-bloom-subtle">
          {message}
        </CardContent>
      </Card>
    </div>
  );
}
