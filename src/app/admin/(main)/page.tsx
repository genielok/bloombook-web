"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Check,
  ClipboardCheck,
  DollarSign,
  Settings,
  Tags,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  type BarShapeProps,
  CartesianGrid,
  Rectangle,
  XAxis,
} from "recharts";
import dayjs from "dayjs";

import {
  type AdminDashboardData,
  getAdminDashboard,
} from "@/app/api/admins/admin";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { bookingStatusClass, bookingStatusLabels } from "./bookings/constants";

const EMPTY_DASHBOARD: AdminDashboardData = {
  revenueThisMonth: 0,
  revenueLast7Days: [],
  todayBookingsCount: 0,
  upcomingBookingsCount: 0,
  completedThisMonthCount: 0,
  todayBookings: [],
};

const chartConfig = {
  amount: {
    label: "Revenue",
    color: "#d9a477",
  },
} satisfies ChartConfig;

const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const quickActions: Array<{
  label: string;
  href: string;
  icon: LucideIcon;
  iconClassName: string;
}> = [
  {
    label: "Service Management",
    href: "/admin/services",
    icon: Tags,
    iconClassName: "bg-[#f4ebe2] text-[#a96c32]",
  },
  {
    label: "Add staff",
    href: "/admin/staff/new",
    icon: UserPlus,
    iconClassName: "bg-[#e7eef5] text-[#3d6b94]",
  },
  {
    label: "View bookings",
    href: "/admin/bookings",
    icon: ClipboardCheck,
    iconClassName: "bg-[#e6f0e8] text-[#3f7350]",
  },
  {
    label: "Edit hours",
    href: "/admin/settings?tab=hours",
    icon: Settings,
    iconClassName: "bg-[#f3e7e9] text-[#9a5268]",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function CustomBar({ x, y, width, height, payload }: BarShapeProps) {
  const isToday = dayjs(payload.date).isSame(dayjs(), "day");

  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      radius={[8, 8, 0, 0]}
      fill={isToday ? "#d9a477" : "#6f6b66"}
    />
  );
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] =
    useState<AdminDashboardData>(EMPTY_DASHBOARD);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    void getAdminDashboard()
      .then(({ data }) => {
        if (!cancelled) setDashboard(data);
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load dashboard.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const metrics = [
    {
      label: "Today's bookings",
      value: dashboard.todayBookingsCount,
      icon: ClipboardCheck,
      iconClassName: "bg-[#f4ebe2] text-[#a96c32]",
    },
    {
      label: "Upcoming bookings",
      value: dashboard.upcomingBookingsCount,
      icon: CalendarDays,
      iconClassName: "bg-[#e7eef5] text-[#3d6b94]",
    },
    {
      label: "Completed this month",
      value: dashboard.completedThisMonthCount,
      icon: Check,
      iconClassName: "bg-[#e6f0e8] text-[#3f7350]",
    },
  ];
  const chartData = dashboard.revenueLast7Days.map((day) => ({
    ...day,
    weekday: dayjs(day.date).format("ddd"),
  }));

  return (
    <div className="w-full">
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <section
        aria-label="Booking overview"
        className="grid grid-cols-1 gap-5 sm:grid-cols-3 xl:grid-cols-[2fr_repeat(3,minmax(0,1fr))]"
      >
        <Card className="h-[220px] gap-0 rounded-[20px] border-0 bg-[#211e1a] py-0 text-white shadow-none ring-0 sm:col-span-3 xl:col-span-1">
          <CardContent className="flex h-full flex-col px-7 pt-4 pb-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[15px] tracking-[0.03em] text-[#c8b6a5]">
                  Revenue this month
                </p>
                <p className="mt-3 font-display text-[42px] leading-none tracking-[-0.035em]">
                  {isLoading
                    ? "—"
                    : currencyFormatter.format(dashboard.revenueThisMonth)}
                </p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#483a2c] text-[#e8c39f]">
                <DollarSign className="size-5" />
              </span>
            </div>
            <ChartContainer
              config={chartConfig}
              className="mt-auto h-[110px] w-full aspect-auto"
            >
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="weekday"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="amount"
                  shape={(props: BarShapeProps) => <CustomBar {...props} />}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {metrics.map((metric) => (
          <Card
            key={metric.label}
            className="h-[220px] gap-0 rounded-[20px] border border-[#e8ded4] bg-white py-0 shadow-none ring-0"
          >
            <CardContent className="px-7 py-6">
              <span
                className={`flex size-10 items-center justify-center rounded-xl ${metric.iconClassName}`}
              >
                <metric.icon className="size-[18px]" />
              </span>
              <p className="mt-4 text-[15px] text-[#8c8175]">{metric.label}</p>
              <p className="mt-3 font-display text-[38px] leading-none tracking-[-0.03em] text-bloom-text">
                {isLoading ? "—" : metric.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-6 grid items-stretch gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(440px,1fr)]">
        <Card className="gap-0 rounded-[16px] border border-[#e8ded4] bg-white py-0 shadow-none ring-0">
          <CardHeader className="gap-1 border-b border-[#eee5dc] px-8 py-6">
            <CardTitle className="text-base font-semibold text-bloom-text">
              Today&apos;s bookings
            </CardTitle>
            <CardDescription className="text-sm text-[#8c8175]">
              {dayjs().format("dddd, DD MMM YYYY")}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0">
            {isLoading ? (
              <div className="px-6 py-10 text-center text-[13px] text-bloom-subtle">
                Loading bookings…
              </div>
            ) : dashboard.todayBookings.length === 0 ? (
              <div className="px-6 py-10 text-center text-[13px] text-bloom-subtle">
                No bookings today.
              </div>
            ) : (
              <div>
                {dashboard.todayBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/admin/bookings/${booking.id}`}
                    className="flex min-h-[88px] items-center gap-5 border-t border-[#eee5dc] px-8 py-4 transition-colors first:border-t-0 hover:bg-[#faf6f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-bloom-accent"
                  >
                    <time className="w-[72px] shrink-0 text-sm font-semibold text-bloom-text">
                      {booking.startTime.slice(0, 5)}
                    </time>
                    <Avatar className="size-12 border-0 bg-[#f4ebe2] after:border-0">
                      <AvatarFallback className="bg-[#f4ebe2] text-xs font-semibold text-bloom-text">
                        {getInitials(booking.customerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-bloom-text">
                        {booking.customerName}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-[#8c8175]">
                        {booking.servicesSnapshot
                          .map((service) => service.name)
                          .join(", ")}{" "}
                        · {booking.staff?.name ?? "Unassigned"}
                      </p>
                    </div>
                    <Badge
                      className={`h-7 border-0 px-3 text-xs font-semibold ${bookingStatusClass[booking.status]}`}
                    >
                      {bookingStatusLabels[booking.status]}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-[16px] border border-[#e8ded4] bg-white py-0 shadow-none ring-0">
          <CardHeader className="px-8 pt-7 pb-5">
            <CardTitle className="text-base font-semibold text-bloom-text">
              Quick actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3.5 px-8 pb-8 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                asChild
                variant="outline"
                className="h-[130px] w-full flex-col items-start justify-center gap-5 rounded-[14px] border-[#eadfd5] bg-white px-5 text-sm font-semibold text-bloom-text shadow-none hover:border-[#dbcdbf] hover:bg-[#faf6f1]"
              >
                <Link href={action.href}>
                  <span
                    className={`flex size-12 items-center justify-center rounded-xl ${action.iconClassName}`}
                  >
                    <action.icon className="size-5" />
                  </span>
                  {action.label}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
