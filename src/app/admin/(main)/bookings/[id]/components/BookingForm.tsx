"use client";

import { useEffect, useState } from "react";
import {
  Controller,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { AdminFormField, AdminInput } from "../../../components/admin-form";
import { type AdminBooking } from "../../../components/bookings-data";
import { type AdminStaff } from "../../../components/staff-data";
import { BookingFormValues } from "../../const";
import {
  bookingStatusClass,
  bookingStatusOptions,
} from "../../constants";
import {
  getStaffList,
  updateBookingDetail,
} from "@/app/api/admins/admin";

const UNASSIGNED_STAFF_VALUE = "__unassigned__";

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

export function BookingForm({ booking }: { booking: AdminBooking }) {
  const router = useRouter();
  const [staffOptions, setStaffOptions] = useState<AdminStaff[]>([]);
  const [isStaffLoading, setIsStaffLoading] = useState(true);
  const [staffError, setStaffError] = useState("");
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<BookingFormValues>({
    defaultValues: {
      status: booking.status,
      staffId: booking.staff?.id ?? "",
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      notes: booking.notes ?? "",
    },
  });
  const status = useWatch({ control, name: "status" });
  const startTime = useWatch({ control, name: "startTime" });

  const appointmentServices = booking.servicesSnapshot.map((service) => ({
    name: service.name,
    duration: service.durationMinutes,
    price: service.price,
  }));

  useEffect(() => {
    let cancelled = false;

    const loadStaff = async () => {
      try {
        const { data } = await getStaffList();
        if (!cancelled) setStaffOptions(data);
      } catch (error) {
        if (!cancelled) {
          setStaffError(
            error instanceof Error ? error.message : "Unable to load staff.",
          );
        }
      } finally {
        if (!cancelled) setIsStaffLoading(false);
      }
    };

    void loadStaff();

    return () => {
      cancelled = true;
    };
  }, []);

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

  const saveChanges: SubmitHandler<BookingFormValues> = async (data) => {
    // Connect the booking update endpoint here when it becomes available.
    try {
      console.log(data);
      const res = await updateBookingDetail({ id: booking.id, ...data });

      reset({
        status: res.data.status,
        staffId: res.data.staff?.id ?? "",
        date: res.data.date,
        startTime: res.data.startTime,
        endTime: res.data.endTime,
        notes: res.data.notes ?? "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const discardAndLeave = () => {
    if (!pendingHref) return;
    const destination = pendingHref;
    setPendingHref(null);
    router.push(destination);
  };

  return (
    <form
      onSubmit={handleSubmit(saveChanges)}
      className="mx-auto w-full max-w-[1440px]"
    >
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
                {String(status).toUpperCase()}
              </Badge>
            </div>
            <p className="mt-1.5 text-[13px] text-bloom-subtle">
              {booking.servicesSnapshot
                .map((service) => service.name)
                .join(", ")}{" "}
              · {booking.date} · {startTime}
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
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminFormField label="Status" htmlFor="booking-status" required>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: "Status is required" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="booking-status"
                        aria-invalid={Boolean(errors.status)}
                        className="h-9 w-full rounded-lg border-bloom-border bg-white px-3 text-[13px] shadow-none"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bookingStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </AdminFormField>

              <AdminFormField label="Staff" htmlFor="booking-staff">
                <Controller
                  name="staffId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || UNASSIGNED_STAFF_VALUE}
                      onValueChange={(value) =>
                        field.onChange(
                          value === UNASSIGNED_STAFF_VALUE ? "" : value,
                        )
                      }
                      disabled={isStaffLoading}
                    >
                      <SelectTrigger
                        id="booking-staff"
                        aria-invalid={Boolean(errors.staffId)}
                        className="h-9 w-full rounded-lg border-bloom-border bg-white px-3 text-[13px] shadow-none"
                      >
                        <SelectValue
                          placeholder={
                            isStaffLoading ? "Loading staff…" : "Select staff"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UNASSIGNED_STAFF_VALUE}>
                          Unassigned
                        </SelectItem>
                        {staffOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {staffError && (
                  <p role="alert" className="text-xs text-red-500">
                    {staffError}
                  </p>
                )}
              </AdminFormField>

              <AdminFormField label="Date" htmlFor="booking-date" required>
                <AdminInput
                  id="booking-date"
                  compact
                  type="date"
                  {...register("date", { required: "Date is required" })}
                  aria-invalid={Boolean(errors.date)}
                />
              </AdminFormField>

              <div className="grid grid-cols-2 gap-2">
                <AdminFormField
                  label="Start time"
                  htmlFor="booking-start-time"
                  required
                >
                  <AdminInput
                    id="booking-start-time"
                    compact
                    type="time"
                    {...register("startTime", {
                      required: "Start time is required",
                    })}
                    aria-invalid={Boolean(errors.startTime)}
                  />
                </AdminFormField>
                <AdminFormField
                  label="End time"
                  htmlFor="booking-end-time"
                  required
                >
                  <AdminInput
                    id="booking-end-time"
                    compact
                    type="time"
                    {...register("endTime", {
                      required: "End time is required",
                    })}
                    aria-invalid={Boolean(errors.endTime)}
                  />
                </AdminFormField>
              </div>
            </div>

            <div className="mt-5">
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
                  {booking.duration} min · €{booking.totalPrice}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 gap-0 rounded-[10px] border border-bloom-border bg-white py-0 shadow-none ring-0">
        <CardHeader className="px-[22px] pt-5 pb-3.5">
          <CardTitle className="font-semibold">Internal notes</CardTitle>
        </CardHeader>
        <CardContent className="px-[22px] pb-5">
          <AdminFormField label="Notes" htmlFor="booking-notes">
            <Textarea
              id="booking-notes"
              {...register("notes", {
                maxLength: {
                  value: 1000,
                  message: "Notes cannot exceed 1000 characters",
                },
              })}
              aria-invalid={Boolean(errors.notes)}
              placeholder="Add a note for staff…"
              className="min-h-[70px] resize-y border-bloom-border bg-[#faf6f1] text-[13px] shadow-none"
            />
            {errors.notes && (
              <p role="alert" className="text-sm text-red-500">
                {errors.notes.message}
              </p>
            )}
          </AdminFormField>
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
              disabled={isSubmitting}
              onClick={() => reset()}
              className="h-10 px-4 font-semibold text-bloom-subtle hover:bg-[#f4ebe2] hover:text-bloom-text"
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 bg-bloom-text px-6 font-semibold text-bloom-bg hover:bg-bloom-text/90"
            >
              {isSubmitting ? "Saving…" : "Save changes"}
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
    </form>
  );
}
