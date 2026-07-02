import Link from "next/link";
import {
  features,
  steps,
  pricingPlans,
  testimonials,
} from "./constants/landing";
import { HeaderComponent } from "./client/component/header";
import { FooterComponent } from "./client/component/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bloom-bg text-bloom-text">
      {/* NAV */}
      <HeaderComponent>
        <nav className="hidden items-center gap-9 text-[15px] text-[#4a4540] md:flex">
          <a href="#features" className="hover:text-bloom-text">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-bloom-text">
            How it works
          </a>
          <a href="#pricing" className="hover:text-bloom-text">
            Pricing
          </a>
          <a href="#testimonials" className="hover:text-bloom-text">
            Reviews
          </a>
        </nav>
      </HeaderComponent>

      {/* HERO */}
      <section className="bloom-container grid gap-16 py-[84px] pb-[76px] lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
        <div>
          <p className="mb-6 text-[13px] font-semibold uppercase tracking-[0.16em] text-bloom-accent-dark">
            Booking software for beauty studios
          </p>
          <h1 className="m-0 font-display text-[82px] font-medium leading-[1.0] tracking-[-0.015em]">
            Beautiful bookings,
            <br />
            <span className="font-display-italic font-normal italic">
              effortlessly
            </span>{" "}
            managed.
          </h1>
          <p className="mt-7 max-w-[480px] text-[19px] leading-[1.6] text-bloom-muted">
            Give your salon its own branded booking page. Clients book in
            seconds — you manage everything from one calm dashboard.
          </p>
          <div className="mt-9 flex items-center gap-4">
            <Link
              href="#pricing"
              className="rounded-pill bg-bloom-accent px-7 py-[15px] text-[16px] font-semibold text-bloom-bg transition hover:opacity-90"
            >
              Start free trial
            </Link>
            <Link
              href="/client/explore"
              className="rounded-pill border border-bloom-border px-6 py-[15px] text-[16px] font-semibold text-bloom-text transition hover:bg-bloom-soft"
            >
              See a live demo →
            </Link>
          </div>
          <p className="mt-5 text-[14px] text-bloom-subtle">
            14-day free trial · No card required · Cancel anytime
          </p>
        </div>

        {/* Hero image placeholder with floating booking card */}
        <div className="relative">
          <div
            className="flex items-end justify-center rounded-card border border-bloom-border p-[18px]"
            style={{
              aspectRatio: "4/4.4",
              background:
                "repeating-linear-gradient(45deg,#F4EBE2,#F4EBE2 12px,#EFE4D8 12px,#EFE4D8 24px)",
            }}
          >
            <span
              className="rounded-pill border border-bloom-border bg-bloom-bg px-3 py-[5px] text-[12px] text-[#A08C78]"
              style={{ fontFamily: "monospace" }}
            >
              studio hero photo
            </span>
          </div>
          <div
            className="absolute bottom-[42px] left-[-32px] w-[248px] rounded-card border border-bloom-border bg-bloom-bg p-[18px]"
            style={{ boxShadow: "0 18px 40px rgba(34,30,26,.12)" }}
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-bloom-success">
              ● Booking confirmed
            </p>
            <p className="font-display text-[20px]">Gel Manicure</p>
            <p className="mt-1 text-[13px] text-bloom-subtle">
              Fri 20 Jun · 14:30 · with Lena
            </p>
            <div className="my-[14px] border-t border-bloom-border" />
            <div className="flex justify-between text-[13px]">
              <span className="text-bloom-subtle">Petal Studio</span>
              <span className="font-semibold">€45</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-bloom-border bg-bloom-soft">
        <div className="bloom-container flex items-center justify-between py-[26px]">
          <span className="text-[13px] uppercase tracking-[0.14em] text-bloom-subtle">
            Trusted by 400+ independent studios
          </span>
          <div className="hidden items-center gap-[46px] font-display text-[21px] text-[#C7B8A8] md:flex">
            <span>Lumière</span>
            <span>Atelier 9</span>
            <span>Nordic Nails</span>
            <span>Marble &amp; Rose</span>
            <span>Studio Linn</span>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bloom-container py-24 pb-[88px]">
        <p className="mb-[18px] text-[13px] font-semibold uppercase tracking-[0.16em] text-bloom-accent-dark">
          What you get
        </p>
        <h2 className="m-0 mb-14 max-w-[720px] font-display text-[52px] font-medium leading-[1.05] tracking-[-0.01em]">
          Everything your studio needs, nothing it doesn&apos;t.
        </h2>
        <div
          className="grid  border-t border-bloom-border"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`pb-2 pt-10 col-span-full md:col-span-1
                 ${
                   index === 0
                     ? "md:border-r md:border-bloom-border md:pr-9"
                     : index === 1
                       ? "md:border-r md:border-bloom-border md:px-9"
                       : "md:pl-9"
                 }`}
            >
              <p className="font-display text-[22px] text-bloom-accent">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mb-3 mt-[18px] font-display text-[28px] font-medium">
                {feature.title}
              </h3>
              <p className="m-0 text-[16px] leading-[1.65] text-bloom-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-[#F4EBE2]">
        <div className="bloom-container grid gap-16 py-[92px] lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="mb-[18px] text-[13px] font-semibold uppercase tracking-[0.16em] text-bloom-accent-dark">
              How it works
            </p>
            <h2 className="m-0 font-display text-[50px] font-medium leading-[1.05] tracking-[-0.01em]">
              Live in an afternoon.
            </h2>
            <p className="mt-[22px] max-w-[340px] text-[17px] leading-[1.6] text-bloom-muted">
              No developers, no setup fees. If you can fill in a form, you can
              run Bloombook.
            </p>
          </div>
          <div className="flex flex-col">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex gap-7 border-t border-[#DFD3C6] py-[26px] ${
                  index === steps.length - 1 ? "border-b border-[#DFD3C6]" : ""
                }`}
              >
                <span className="w-[60px] font-display text-[46px] leading-none text-bloom-accent">
                  {step.number}
                </span>
                <div>
                  <h3 className="m-0 mb-2 font-display text-[26px] font-medium">
                    {step.title}
                  </h3>
                  <p className="m-0 max-w-[520px] text-[16px] leading-[1.6] text-bloom-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bloom-container py-24 pb-[90px]">
        <div className="mb-14 text-center">
          <p className="mb-[18px] text-[13px] font-semibold uppercase tracking-[0.16em] text-bloom-accent-dark">
            Pricing
          </p>
          <h2 className="m-0 font-display text-[52px] font-medium leading-[1.05] tracking-[-0.01em]">
            Simple plans that grow with you.
          </h2>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-card p-8 ${
                plan.highlighted
                  ? "border-[1.5px] border-bloom-accent bg-bloom-bg"
                  : "border border-bloom-border bg-bloom-soft"
              }`}
              style={
                plan.highlighted
                  ? { boxShadow: "0 18px 44px rgba(201,149,106,.16)" }
                  : undefined
              }
            >
              {plan.highlighted && (
                <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 rounded-pill bg-bloom-accent px-[14px] py-[6px] text-[11px] font-bold uppercase tracking-[0.1em] text-bloom-bg">
                  Most popular
                </div>
              )}
              <p className="font-display text-[24px]">{plan.name}</p>
              <div className="my-4">
                <span className="font-display text-[54px]">{plan.price}</span>
                <span className="text-[15px] text-bloom-subtle"> /month</span>
              </div>
              <p className="m-0 mb-6 text-[14px] text-bloom-subtle">
                {plan.description}
              </p>
              <Link
                href="#"
                className={`block rounded-pill py-[13px] text-center text-[15px] font-semibold transition ${
                  plan.highlighted
                    ? "bg-bloom-accent text-bloom-bg hover:opacity-90"
                    : "border border-bloom-text text-bloom-text hover:opacity-80"
                }`}
              >
                {plan.name === "Free" ? "Get started" : "Start free trial"}
              </Link>
              <ul className="m-0 mt-[26px] list-none p-0 text-[15px] text-[#4a4540]">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="border-t border-bloom-border py-[11px]"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="bg-bloom-text text-bloom-bg">
        <div className="bloom-container py-24">
          <p className="mb-12 text-[13px] font-semibold uppercase tracking-[0.16em] text-bloom-accent">
            Loved by studio owners
          </p>
          <div className="grid gap-16 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name}>
                <blockquote className="m-0 font-display text-[30px] font-normal leading-[1.32] tracking-[-0.01em]">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="mt-7 flex items-center gap-[14px]">
                  <div
                    className="h-[46px] w-[46px] flex-none rounded-full"
                    style={{
                      background:
                        "repeating-linear-gradient(45deg,#3a342e,#3a342e 6px,#433c34 6px,#433c34 12px)",
                    }}
                  />
                  <div>
                    <p className="m-0 text-[15px] font-semibold">
                      {testimonial.name}
                    </p>
                    <p className="m-0 mt-1 text-[14px] text-[#B7A99B]">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bloom-container py-[104px] text-center">
        <h2 className="mx-auto m-0 max-w-[820px] font-display text-[64px] font-medium leading-[1.04] tracking-[-0.015em]">
          Your studio deserves a{" "}
          <span className="font-display-italic font-normal italic">
            beautiful
          </span>{" "}
          booking page.
        </h2>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="#pricing"
            className="rounded-pill bg-bloom-accent px-8 py-4 text-[16px] font-semibold text-bloom-bg transition hover:opacity-90"
          >
            Start free trial
          </Link>
          <Link
            href="/explore"
            className="rounded-pill border border-bloom-border px-7 py-4 text-[16px] font-semibold text-bloom-text transition hover:bg-bloom-soft"
          >
            Book a walkthrough →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <FooterComponent></FooterComponent>
    </main>
  );
}
