import { Booking } from "@/app/api/clients/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dayjs from "dayjs";

export const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
};

export function BookingCard({
  booking,
  activeTab,
}: {
  booking: Booking;
  activeTab: "upcoming" | "history";
}) {
  const router = useRouter();

  const directManagePage = () => {
    router.push(`/client/account/manageBooking?bookingId=${booking.reference}`);
  };

  return (
    <article className="flex flex-col gap-4 rounded-[12px] border border-bloom-border bg-white p-4 md:flex-row md:items-center md:justify-between md:px-5">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={directManagePage}
      >
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px]">
          <Image
            fill
            className="object-cover"
            src={booking.salon.imgUrl}
            alt={booking.salon.name}
          />
        </div>
        <div>
          <div className="text-[15px] font-semibold">
            {booking.servicesSnapshot.map((item) => item.name).join(",")}
          </div>
          <div className="mt-1 text-[13px] leading-5 text-bloom-subtle">
            {`${dayjs(booking.date).format("ddd DD MMM YYYY")} · ${booking.startTime} · ${booking.salon.name}, ${booking.salon.address.split(",")[0]}`}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 md:justify-end md:gap-[18px]">
        <span
          className={`rounded-pill px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] ${statusStyles[booking.status] ?? "bg-gray-100 text-gray-700"}`}
        >
          {booking.status}
        </span>
        <Button
          onClick={directManagePage}
          className={`shrink-0 rounded-pill text-[14px] font-semibold ${
            activeTab === "upcoming"
              ? "bg-bloom-text px-[18px] py-2 text-bloom-bg"
              : "bg-bloom-accent px-[18px] py-2 text-bloom-bg"
          }`}
        >
          {activeTab === "upcoming" ? "Manage" : "View"}
        </Button>
      </div>
    </article>
  );
}
