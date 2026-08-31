"use client";

import { useEffect, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import {
  getCalendarBookings,
  getStaffList,
  getStudioInfo,
} from "@/app/api/admins/admin";
import { type BusinessHour } from "@/app/api/clients/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type AdminBooking,
  type BookingStatus,
} from "../components/bookings-data";
import { type AdminStaff } from "../components/staff-data";
import {
  bookingStatusDotClass,
  bookingStatusFilterOptions,
  bookingStatusLabels,
} from "../bookings/constants";

const ALL_STAFF = "All";
const UNASSIGNED_STAFF = "Unassigned";

function startOfMonday(date: Dayjs) {
  const daysSinceMonday = (date.day() + 6) % 7;
  return date.startOf("day").subtract(daysSinceMonday, "day");
}

export default function AdminCalendarPage() {
  const today = dayjs().startOf("day");
  const [weekOffset, setWeekOffset] = useState(0);
  const [staff, setStaff] = useState(ALL_STAFF);
  const [status, setStatus] = useState("All");
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [staffOptions, setStaffOptions] = useState<AdminStaff[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const weekStart = startOfMonday(today).add(weekOffset, "week");
  const weekDays = Array.from({ length: 7 }, (_, index) =>
    weekStart.add(index, "day"),
  );
  const weekLabel = `${weekDays[0].format("ddd D MMM")} – ${weekDays[6].format("ddd D MMM")}`;
  const weekStartKey = weekStart.format("YYYY-MM-DD");
  const weekEndKey = weekStart.add(6, "day").format("YYYY-MM-DD");

  useEffect(() => {
    let cancelled = false;

    void Promise.all([getStaffList(), getStudioInfo()])
      .then(([staffResponse, studioResponse]) => {
        if (cancelled) return;
        setStaffOptions(staffResponse.data);
        setBusinessHours(studioResponse.data.businessHours ?? []);
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load calendar filters.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadBookings = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await getCalendarBookings({
          startDate: weekStartKey,
          endDate: weekEndKey,
          status: status === "All" ? null : (status as BookingStatus),
          staffId:
            staff === ALL_STAFF || staff === UNASSIGNED_STAFF ? null : staff,
          unassignedOnly: staff === UNASSIGNED_STAFF,
        });
        if (!cancelled) setBookings(response.data);
      } catch (loadError) {
        if (!cancelled) {
          setBookings([]);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load bookings.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadBookings();

    return () => {
      cancelled = true;
    };
  }, [staff, status, weekEndKey, weekStartKey]);

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Previous week"
            onClick={() => setWeekOffset((offset) => offset - 1)}
            className="size-9 border-bloom-border bg-white shadow-none"
          >
            <ChevronLeft />
          </Button>
          <p className="min-w-[190px] text-center text-sm font-semibold text-bloom-text">
            {weekLabel}
          </p>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Next week"
            onClick={() => setWeekOffset((offset) => offset + 1)}
            className="size-9 border-bloom-border bg-white shadow-none"
          >
            <ChevronRight />
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setWeekOffset(0)}
            disabled={weekOffset === 0}
            className="h-9 px-2 text-[13px] font-semibold text-bloom-accent-dark hover:bg-[#f4ebe2] hover:text-bloom-accent-dark"
          >
            Today
          </Button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <CalendarFilter
            value={staff}
            onChange={setStaff}
            label="All staff"
            items={[
              ALL_STAFF,
              UNASSIGNED_STAFF,
              ...staffOptions.map((option) => option.id),
            ]}
            getItemLabel={(item) =>
              item === UNASSIGNED_STAFF
                ? UNASSIGNED_STAFF
                : (staffOptions.find((option) => option.id === item)?.name ??
                  item)
            }
          />
          <CalendarFilter
            value={status}
            onChange={setStatus}
            label="All statuses"
            items={bookingStatusFilterOptions}
            getItemLabel={(item) =>
              bookingStatusLabels[item as keyof typeof bookingStatusLabels]
            }
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[1050px] grid-cols-7 gap-2.5">
          {weekDays.map((date) => {
            const dateKey = date.format("YYYY-MM-DD");
            const isToday = date.isSame(today, "day");
            const dayOfWeek = (date.day() + 6) % 7;
            const businessHour = businessHours.find(
              (hours) => hours.dayOfWeek === dayOfWeek,
            );
            const isClosed = businessHour ? !businessHour.isOpen : false;
            const dayBookings = bookings.filter(
              (booking) => booking.date === dateKey,
            );

            return (
              <CalendarDay
                key={dateKey}
                date={date}
                isToday={isToday}
                isClosed={isClosed}
                isLoading={isLoading}
                bookings={dayBookings}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CalendarDay({
  date,
  isToday,
  isClosed,
  isLoading,
  bookings,
}: {
  date: Dayjs;
  isToday: boolean;
  isClosed: boolean;
  isLoading: boolean;
  bookings: AdminBooking[];
}) {
  return (
    <Card className="min-h-[340px] gap-0 rounded-[10px] border border-bloom-border bg-white py-0 shadow-none ring-0">
      <CardHeader
        className={`gap-0.5 border-b border-[#f0e9e1] px-3 py-2.5 text-center ${isToday ? "bg-[#f4ebe2]" : "bg-[#faf6f1]"}`}
      >
        <p className="text-[11px] font-medium tracking-[0.06em] text-bloom-subtle uppercase">
          {date.format("ddd")}
        </p>
        <p className="text-[13px] font-semibold text-bloom-text">
          {date.format("D MMM")}
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-1.5 px-2 py-2">
        {isLoading ? (
          <p className="py-3.5 text-center text-xs text-bloom-subtle">
            Loading…
          </p>
        ) : isClosed && bookings.length === 0 ? (
          <p className="py-3.5 text-center text-xs text-bloom-subtle">Closed</p>
        ) : bookings.length === 0 ? (
          <p className="py-3.5 text-center text-xs text-[#c8beb2]">—</p>
        ) : (
          bookings.map((booking) => (
            <Button
              key={booking.id}
              asChild
              variant="outline"
              className="h-auto w-full flex-col items-stretch gap-0 rounded-lg border-[#f0e9e1] bg-white px-2.5 py-2 text-left shadow-none hover:border-bloom-border hover:bg-[#faf6f1]"
            >
              <Link href={`/admin/bookings/${booking.id}`}>
                <span className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-bloom-text">
                    {booking.startTime}
                  </span>
                  <span
                    className={`size-[7px] rounded-full ${bookingStatusDotClass[booking.status]}`}
                    title={booking.status}
                  />
                </span>
                <span className="mt-1 truncate text-xs font-semibold text-bloom-text">
                  {booking.customerName}
                </span>
                <span className="truncate text-[11px] font-normal text-bloom-subtle">
                  {booking.servicesSnapshot
                    .map((service) => service.name)
                    .join(", ")}
                </span>
                <span className="truncate text-[11px] font-normal text-bloom-subtle">
                  {booking.staff?.name ?? "Unassigned"}
                </span>
              </Link>
            </Button>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function CalendarFilter({
  value,
  onChange,
  label,
  items,
  getItemLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  items: readonly string[];
  getItemLabel?: (item: string) => string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label={label}
        className="h-9 min-w-[140px] border-bloom-border bg-white text-[13px] shadow-none focus-visible:border-bloom-accent focus-visible:ring-bloom-accent/20"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item} value={item}>
            {item === "All" ? label : (getItemLabel?.(item) ?? item)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
