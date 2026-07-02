import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IBookingDetail } from "@/app/api/bookingDetail/types";

interface Props {
  bookingDetail: IBookingDetail;
}
export const ConfirmPageClient = (props: Props) => {
  const { bookingDetail } = props;
  const {
    appointment,
    bookingId,
    bookingReference,
    customer,
    policy,
    receipt,
    studio,
  } = bookingDetail;
  const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-bloom-bg">
      <main className="grid min-h-[calc(100vh-73px)] items-center gap-12 px-8 py-16 md:px-14 lg:grid-cols-2 lg:gap-16">
        <section>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bloom-success text-bloom-bg">
            <Check className="h-11 w-11 stroke-[2.4]" />
          </div>

          <h1 className="mt-4 max-w-[560px] font-display text-[56px] font-medium leading-[1.04] tracking-[-0.015em] text-bloom-text md:text-[60px]">
            Booking confirmed
          </h1>

          <p className="mt-6 max-w-[440px] text-[17px] leading-[1.6] text-bloom-muted">
            A confirmation and calendar invite are on their way to{" "}
            <span className="font-semibold text-bloom-text">
              {customer.email}
            </span>
            . We&apos;ve also sent the studio&apos;s address and a link to
            manage your booking.
          </p>

          <div className="mt-9 flex flex-wrap gap-3.5">
            <Button
              asChild
              className="rounded-full bg-bloom-text px-7 py-6 text-base font-semibold text-bloom-bg hover:bg-bloom-text/90"
            >
              <Link href={`/client/confirm?bookingId=${bookingId}`}>
                Add to calendar
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-bloom-border bg-transparent px-7 py-6  text-base font-semibold text-bloom-text hover:bg-bloom-soft"
            >
              <Link href="/client/account">Manage booking</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-8 border-t border-bloom-border pt-7">
            <div>
              <div className="mb-1.5 text-xs text-bloom-subtle">
                Booking reference
              </div>
              <div className="font-display text-xl tracking-[0.04em] text-bloom-text">
                #{bookingReference}
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-xs text-bloom-subtle">
                Need to reschedule?
              </div>
              <div className="text-[15px] font-semibold text-bloom-accent-dark">
                {policy.reschedule}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-[460px] overflow-hidden rounded-panel border border-bloom-border bg-white">
            <div className="relative flex h-[150px] items-end bg-[repeating-linear-gradient(45deg,#EFE0D0,#EFE0D0_14px,#E7D6C3_14px,#E7D6C3_28px)] p-3.5">
              <span className="rounded-full bg-bloom-bg px-2.5 py-1 font-mono text-[11px] text-[#A08C78]">
                {studio.coverLabel}
              </span>
            </div>

            <div className="px-6 py-6">
              <h2 className="font-display text-[26px] leading-tight text-bloom-text">
                {appointment.serviceName}
              </h2>
              <div className="mt-1 text-[13px] text-bloom-subtle">
                {appointment.duration} minutes · with {appointment.technician}
              </div>

              <div className="mt-[22px] flex flex-col gap-[13px]">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-bloom-subtle">When</span>
                  <span className="text-right font-semibold text-bloom-text">
                    {appointment.displayDateTime}
                  </span>
                </div>
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-bloom-subtle">Where</span>
                  <span className="text-right font-semibold text-bloom-text">
                    {studio.name}, {studio.area}
                  </span>
                </div>
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-bloom-subtle">Technician</span>
                  <span className="text-right font-semibold text-bloom-text">
                    {appointment.technician}
                  </span>
                </div>
              </div>

              <div className="my-5 h-px bg-bloom-border" />

              <div className="flex flex-col gap-[11px]">
                {receipt.lineItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-bloom-subtle"
                  >
                    <span>{item.label}</span>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                {receipt.promo && (
                  <div className="flex justify-between text-sm text-bloom-success">
                    <span>{receipt.promo.label}</span>
                    <span>−{formatCurrency(receipt.promo.discount)}</span>
                  </div>
                )}
                <div className="flex items-baseline justify-between border-t border-bloom-border pt-[11px]">
                  <span className="text-sm text-bloom-subtle">
                    Paid · {receipt.paid.method} ••{receipt.paid.last4}
                  </span>
                  <span className="font-display text-2xl text-bloom-success">
                    {formatCurrency(receipt.paid.amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
