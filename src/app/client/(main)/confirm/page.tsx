import { ConfirmPageClient } from "./confirmPageClient";

interface ConfirmPageProps {
  searchParams: Promise<{ bookingId: string }>;
}

export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const { bookingId } = await searchParams;
  return <ConfirmPageClient bookingId={bookingId} />;
}
