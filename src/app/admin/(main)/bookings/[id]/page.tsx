"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdminInput } from "../../components/admin-form";
import {
  adminBookings,
  bookingStatusClass,
  type BookingStatus,
} from "../../components/bookings-data";

const staffOptions = [
  "Unassigned",
  "Mara Voss",
  "Lena Hoffmann",
  "Emma Richter",
  "Sophia Lindqvist",
];
const statusOptions: BookingStatus[] = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
  "No-show",
];

type BookingFormValues = {
  status: BookingStatus;
  staff: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
};

export default function AdminBookingDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const booking =
    adminBookings.find((item) => item.id === id) ?? adminBookings[0];
  const initialValues = useMemo<BookingFormValues>(
    () => ({
      status: booking.status,
      staff: booking.staffName,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      notes: "",
    }),
    [booking],
  );
  const [savedValues, setSavedValues] =
    useState<BookingFormValues>(initialValues);
  const [status, setStatus] = useState<BookingStatus>(initialValues.status);
  const [staff, setStaff] = useState(initialValues.staff);
  const [date, setDate] = useState(initialValues.date);
  const [startTime, setStartTime] = useState(initialValues.startTime);
  const [endTime, setEndTime] = useState(initialValues.endTime);
  const [notes, setNotes] = useState(initialValues.notes);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const currentValues = useMemo<BookingFormValues>(
    () => ({ status, staff, date, startTime, endTime, notes }),
    [date, endTime, notes, staff, startTime, status],
  );
  const isDirty = useMemo(
    () => JSON.stringify(currentValues) !== JSON.stringify(savedValues),
    [currentValues, savedValues],
  );
  const appointmentServices = booking.services?.length
    ? booking.services
    : [
        {
          name: booking.serviceName,
          duration: booking.duration,
          price: booking.price,
        },
      ];
  const totalDuration = appointmentServices.reduce(
    (total, service) => total + service.duration,
    0,
  );
  const totalPrice = appointmentServices.reduce(
    (total, service) => total + service.price,
    0,
  );

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const handleLinkClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      const currentLocation = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const nextLocation = `${destination.pathname}${destination.search}${destination.hash}`;
      if (currentLocation === nextLocation) return;

      event.preventDefault();
      event.stopPropagation();
      setPendingHref(nextLocation);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleLinkClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleLinkClick, true);
    };
  }, [isDirty]);

  const resetChanges = () => {
    setStatus(savedValues.status);
    setStaff(savedValues.staff);
    setDate(savedValues.date);
    setStartTime(savedValues.startTime);
    setEndTime(savedValues.endTime);
    setNotes(savedValues.notes);
  };

  const saveChanges = () => {
    setSavedValues(currentValues);
  };

  const discardAndLeave = () => {
    if (!pendingHref) return;
    const destination = pendingHref;
    setPendingHref(null);
    router.push(destination);
  };

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <Button
        asChild
        variant="link"
        className="mb-4 h-auto gap-1.5 px-0 text-[13px] font-semibold text-bloom-accent-dark hover:text-[#7a5029]"
      >
        <Link href="/admin/bookings">
          <ArrowLeft className="size-3.5" /> All bookings
        </Link>
      </Button>

      <Card className="gap-0 rounded-[10px] border border-bloom-border bg-white py-0 shadow-none ring-0">
        <CardContent className="flex flex-col gap-5 px-6 py-[22px] sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-display text-[22px] leading-tight text-bloom-text">
                {booking.customerName}
              </h2>
              <Badge
                className={`h-[22px] border-0 px-2.5 text-[11px] font-semibold ${bookingStatusClass[status]}`}
              >
                {status}
              </Badge>
            </div>
            <p className="mt-1.5 text-[13px] text-bloom-subtle">
              {booking.serviceName} · {booking.dateLabel} · {startTime}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="gap-0 rounded-[10px] border border-bloom-border bg-white py-0 shadow-none ring-0">
          <CardHeader className="px-[22px] pt-5 pb-3.5">
            <CardTitle className="font-semibold">
              Customer information
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-[22px] pb-5 text-[13px]">
            <InfoRow label="Name" value={booking.customerName} />
            <InfoRow label="Email" value={booking.customerEmail} />
            <InfoRow label="Phone" value={booking.customerPhone} />
            <InfoRow label="Notes" value={booking.customerNotes} multiline />
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-[10px] border border-bloom-border bg-white py-0 shadow-none ring-0">
          <CardHeader className="px-[22px] pt-5 pb-3.5">
            <CardTitle className="font-semibold text-bloom-text">
              Appointment
            </CardTitle>
          </CardHeader>
          <CardContent className="px-[22px] pb-5 text-[13px]">
            <AppointmentRow label="Status">
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as BookingStatus)}
              >
                <SelectTrigger
                  aria-label="Booking status"
                  className="h-9 min-w-[140px] rounded-lg border-bloom-border bg-white px-3 text-[13px] shadow-none focus-visible:border-bloom-accent focus-visible:ring-bloom-accent/20"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AppointmentRow>

            <div className="mt-4">
              <p className="mb-1 text-bloom-subtle">Services</p>
              <div>
                {appointmentServices.map((service) => (
                  <div
                    key={`${service.name}-${service.duration}`}
                    className="flex items-center justify-between gap-4 border-b border-[#eee5dc] py-2"
                  >
                    <span className="font-medium text-bloom-text">
                      {service.name}
                    </span>
                    <span className="shrink-0 text-bloom-subtle">
                      {service.duration} min · €{service.price}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between gap-4 pt-3">
                <span className="text-bloom-subtle">Total</span>
                <span className="font-semibold text-bloom-text">
                  {totalDuration} min · €{totalPrice}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <AppointmentRow label="Staff">
                <Select value={staff} onValueChange={setStaff}>
                  <SelectTrigger
                    aria-label="Assigned staff"
                    className="h-9 min-w-[150px] rounded-lg border-bloom-border bg-white px-3 text-[13px] shadow-none focus-visible:border-bloom-accent focus-visible:ring-bloom-accent/20"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {staffOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AppointmentRow>
              <AppointmentRow label="Date">
                <div className="w-[180px]">
                  <AdminInput
                    compact
                    required
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="w-full px-3"
                  />
                </div>
              </AppointmentRow>
              <AppointmentRow label="Time">
                <div className="grid w-full max-w-[260px] grid-cols-2 gap-2">
                  <AdminInput
                    compact
                    required
                    aria-label="Start time"
                    type="time"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                    className="w-full px-3"
                  />
                  <AdminInput
                    compact
                    required
                    aria-label="End time"
                    type="time"
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                    className="w-full px-3"
                  />
                </div>
              </AppointmentRow>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 gap-0 rounded-[10px] border border-bloom-border bg-white py-0 shadow-none ring-0">
        <CardHeader className="px-[22px] pt-5 pb-3.5">
          <CardTitle className=" font-semibold">Internal notes</CardTitle>
        </CardHeader>
        <CardContent className="px-[22px] pb-5">
          <Textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add a note for staff…"
            className="min-h-[70px] resize-y border-bloom-border bg-[#faf6f1] text-[13px] shadow-none focus-visible:border-bloom-accent focus-visible:ring-bloom-accent/20"
          />
          <div className="mt-3 flex flex-col gap-1 text-xs text-bloom-subtle sm:flex-row sm:justify-between">
            <span>Created {booking.createdAt}</span>
            <span>Updated {booking.updatedAt}</span>
          </div>
        </CardContent>
      </Card>

      {isDirty && (
        <div className="sticky bottom-4 z-20 mt-4 flex flex-col gap-4 rounded-2xl border border-[#efd4aa] bg-[#fff7eb] px-5 py-5 shadow-[0_12px_30px_rgba(34,30,26,0.08)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-sm font-semibold text-[#a26732]">
            Unsaved changes
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={resetChanges}
              className="h-10 px-4 font-semibold text-bloom-subtle hover:bg-[#f4ebe2] hover:text-bloom-text"
            >
              Reset
            </Button>
            <Button
              type="button"
              onClick={saveChanges}
              className="h-10 bg-bloom-text px-6 font-semibold text-bloom-bg hover:bg-bloom-text/90"
            >
              Save changes
            </Button>
          </div>
        </div>
      )}

      <AlertDialog
        open={pendingHref !== null}
        onOpenChange={(open) => {
          if (!open) setPendingHref(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have changes that have not been saved. If you leave this page,
              those changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay on page</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={discardAndLeave}>
              Discard and leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function InfoRow({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <span className="shrink-0 text-bloom-subtle">{label}</span>
      <span
        className={`font-medium ${multiline ? "max-w-[220px] text-right" : "text-right break-all"}`}
      >
        {value}
      </span>
    </div>
  );
}

function AppointmentRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-bloom-subtle">{label}</span>
      {children}
    </div>
  );
}
