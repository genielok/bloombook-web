import Link from "next/link";
import type { AccountBooking } from "@/app/api/account/bookings/types";

export function BookingCard({
  booking,
  index,
  activeTab,
}: {
  booking: AccountBooking;
  index: number;
  activeTab: "upcoming" | "history";
}) {
  return (
    <article className="flex flex-col gap-4 rounded-[12px] border border-bloom-border bg-white p-4 md:flex-row md:items-center md:justify-between md:px-5">
      <div className="flex items-center gap-4">
        <div
          className={`size-12 shrink-0 rounded-[10px] ${
            index % 2 === 0
              ? "bg-[repeating-linear-gradient(45deg,#EFE0D0,#EFE0D0_5px,#E7D6C3_5px,#E7D6C3_10px)]"
              : "bg-[repeating-linear-gradient(45deg,#E7D6C3,#E7D6C3_5px,#DCC8B2_5px,#DCC8B2_10px)]"
          }`}
        />
        <div>
          <div className="text-[15px] font-semibold">{booking.service}</div>
          <div className="mt-1 text-[13px] leading-5 text-bloom-subtle">
            {booking.meta}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 md:justify-end md:gap-[18px]">
        <span
          className={`rounded-pill px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] ${booking.statusClass}`}
        >
          {booking.status}
        </span>
        <Link
          href={booking.actionHref}
          className={`shrink-0 rounded-pill text-[14px] font-semibold ${
            activeTab === "upcoming"
              ? "bg-bloom-text px-[18px] py-2 text-bloom-bg"
              : "bg-bloom-accent px-[18px] py-2 text-bloom-bg"
          }`}
        >
          {booking.action}
        </Link>
      </div>
    </article>
  );
}
