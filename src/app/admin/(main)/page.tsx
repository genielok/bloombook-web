"use client";
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
import dayjs from "dayjs";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type BookingStatus = "Pending" | "Confirmed" | "Completed";

type Booking = {
  id: string;
  startTime: string;
  customerName: string;
  serviceName: string;
  staffName: string;
  status: BookingStatus;
  avatarClassName: string;
};

const metrics = [
  {
    label: "Today's bookings",
    value: "3",
    icon: ClipboardCheck,
    iconClassName: "bg-[#f4ebe2] text-[#a96c32]",
  },
  {
    label: "Upcoming bookings",
    value: "31",
    icon: CalendarDays,
    iconClassName: "bg-[#e7eef5] text-[#3d6b94]",
  },
  {
    label: "Completed this month",
    value: "23",
    icon: Check,
    iconClassName: "bg-[#e6f0e8] text-[#3f7350]",
  },
];

const chartData = Array.from({ length: 7 }, (_, index) => {
  const date = dayjs().subtract(6 - index, "day");

  return {
    date: date.format("YYYY-MM-DD"),
    weekday: date.format("ddd"),
    desktop: [36, 15, 57, 46, 33, 5, 5][index],
  };
});

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#d9a477",
  },
} satisfies ChartConfig;

const todaysBookings: Booking[] = [
  {
    id: "bk37",
    startTime: "09:30",
    customerName: "Nils Haas",
    serviceName: "Classic Manicure",
    staffName: "Lena Hoffmann",
    status: "Confirmed",
    avatarClassName: "bg-[#f4ebe2]",
  },
  {
    id: "bk38",
    startTime: "12:00",
    customerName: "Adam Kowalski",
    serviceName: "Lash Lift & Tint",
    staffName: "Sophia Lindqvist",
    status: "Confirmed",
    avatarClassName: "bg-[#e6f0e8]",
  },
  {
    id: "bk39",
    startTime: "15:30",
    customerName: "Erik García",
    serviceName: "Acrylic Full Set",
    staffName: "Emma Richter",
    status: "Confirmed",
    avatarClassName: "bg-[#efe0d0]",
  },
];

const statusStyles: Record<BookingStatus, string> = {
  Pending: "bg-[#fdf3e7] text-[#a06b3d]",
  Confirmed: "bg-[#e7eef5] text-[#3d6b94]",
  Completed: "bg-[#e6f0e8] text-[#3f7350]",
};

const quickActions: Array<{
  label: string;
  href: string;
  icon: LucideIcon;
  iconClassName: string;
}> = [
  {
    label: "Create service",
    href: "/admin/services/new",
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

const dashboardDate = dayjs(new Date());

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
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
  return (
    <div className="w-full">
      <section
        aria-label="Booking overview"
        className="grid grid-cols-1 gap-5 sm:grid-cols-3 xl:grid-cols-[2fr_repeat(3,minmax(0,1fr))]"
      >
        <Card className="h-[220px]  gap-0 rounded-[20px] border-0 bg-[#211e1a] py-0 text-white shadow-none ring-0 sm:col-span-3 xl:col-span-1">
          <CardContent className="flex h-full flex-col px-7 pt-4 pb-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[15px] tracking-[0.03em] text-[#c8b6a5]">
                  Revenue
                </p>
                <p className="mt-3 font-display text-[42px] leading-none tracking-[-0.035em]">
                  €1,093
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
                  tickFormatter={(value) => value.slice(0, 3)}
                />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />

                <Bar
                  dataKey="desktop"
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
                {metric.value}
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
              {dashboardDate.format("dddd, DD MMM YYYY")}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0">
            {todaysBookings.length === 0 ? (
              <div className="px-6 py-10 text-center text-[13px] text-bloom-subtle">
                No bookings today.
              </div>
            ) : (
              <div>
                {todaysBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/admin/bookings/${booking.id}`}
                    className="flex min-h-[88px] items-center gap-5 border-t border-[#eee5dc] px-8 py-4 transition-colors first:border-t-0 hover:bg-[#faf6f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-bloom-accent"
                  >
                    <time className="w-[72px] shrink-0 text-sm font-semibold text-bloom-text">
                      {booking.startTime}
                    </time>
                    <Avatar
                      className={`size-12 border-0 after:border-0 ${booking.avatarClassName}`}
                    >
                      <AvatarFallback
                        className={`text-xs font-semibold text-bloom-text ${booking.avatarClassName}`}
                      >
                        {getInitials(booking.customerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-bloom-text">
                        {booking.customerName}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-[#8c8175]">
                        {booking.serviceName} · {booking.staffName}
                      </p>
                    </div>
                    <Badge
                      className={`h-7 border-0 px-3 text-xs font-semibold ${statusStyles[booking.status]}`}
                    >
                      {booking.status}
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
