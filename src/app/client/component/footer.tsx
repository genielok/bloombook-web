import React from "react";

export const FooterComponent = () => {
  return (
    <footer className="border-t border-bloom-border bg-bloom-soft">
      <div className="bloom-container pb-10 pt-14">
        <div className="grid gap-10 border-b border-bloom-border pb-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="m-0 font-display text-[24px]">
              Bloombook <span className="text-bloom-accent">❋</span>
            </p>
            <p className="mt-[14px] max-w-[260px] text-[14px] leading-[1.6] text-bloom-subtle">
              Booking &amp; management for independent beauty studios across
              Europe.
            </p>
          </div>
          <div>
            <p className="m-0 mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-bloom-accent-dark">
              Product
            </p>
            <div className="flex flex-col gap-[11px] text-[14px] text-bloom-muted">
              <span>Features</span>
              <span>Pricing</span>
              <span>Booking page</span>
              <span>Dashboard</span>
            </div>
          </div>
          <div>
            <p className="m-0 mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-bloom-accent-dark">
              Company
            </p>
            <div className="flex flex-col gap-[11px] text-[14px] text-bloom-muted">
              <span>About</span>
              <span>Blog</span>
              <span>Careers</span>
              <span>Contact</span>
            </div>
          </div>
          <div>
            <p className="m-0 mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-bloom-accent-dark">
              Legal
            </p>
            <div className="flex flex-col gap-[11px] text-[14px] text-bloom-muted">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Imprint</span>
              <span>GDPR</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-6">
          <span className="text-[13px] text-bloom-subtle">
            © 2026 Bloombook. Made in Europe.
          </span>
          <div className="flex items-center rounded-pill border border-bloom-border p-[3px] text-xs font-semibold">
            <span className="rounded-pill bg-bloom-text px-[11px] py-[5px] text-bloom-bg">
              EN
            </span>
            <span className="px-[11px] py-[5px] text-bloom-subtle">DE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
