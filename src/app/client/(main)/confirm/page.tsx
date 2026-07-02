import { getBookingDetailData } from "@/app/api/bookingDetail/data";
import { ConfirmPageClient } from "./confirmPageClient";

interface ConfirmPageProps {
  searchParams: Promise<{ bookingId: string }>;
}

export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const { bookingId } = await searchParams;

  const bookingDetail = getBookingDetailData(bookingId);

  return <ConfirmPageClient bookingDetail={bookingDetail} />;
}
