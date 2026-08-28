"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";

import type { StudioSettings } from "@/app/api/admins/admin";
import { AdminFormField, AdminInput } from "../../components/admin-form";
import { FilterSelect } from "../../components/filterSelect";

const slotIntervals = ["15", "30", "60"] as const;

export function BookingSettingsForm() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<StudioSettings>();

  const [slotIntervalMinutes, capacity] = useWatch({
    control,
    name: ["slotIntervalMinutes", "capacity"],
  });

  return (
    <section className="mt-6 border-t border-bloom-border pt-5">
      <div>
        <h2 className="text-sm font-semibold text-bloom-text">
          Booking settings
        </h2>
        <p className="mt-1 text-xs text-bloom-subtle">
          Control how appointment availability is generated.
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <AdminFormField
          label="Appointment start interval"
          htmlFor="slot-interval"
          required
        >
          <Controller
            name="slotIntervalMinutes"
            control={control}
            rules={{ required: "Slot interval is required" }}
            render={({ field }) => (
              <FilterSelect
                id="slot-interval"
                name={field.name}
                required
                label="Select an interval"
                items={slotIntervals}
                value={String(field.value)}
                onChange={(value) => field.onChange(Number(value))}
                className="h-10 w-full"
              />
            )}
          />
        </AdminFormField>

        <AdminFormField
          label="Maximum concurrent bookings"
          htmlFor="studio-capacity"
          required
        >
          <AdminInput
            id="studio-capacity"
            type="number"
            min={1}
            max={20}
            step={1}
            {...register("capacity", {
              required: "Capacity is required",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Capacity must be at least 1",
              },
              max: {
                value: 20,
                message: "Capacity cannot exceed 20",
              },
            })}
            aria-invalid={Boolean(errors.capacity)}
          />
          {errors.capacity && (
            <p role="alert" className="text-sm text-red-500">
              {errors.capacity.message}
            </p>
          )}
        </AdminFormField>
      </div>

      <div className="mt-5 rounded-lg bg-[#faf6f1] px-4 py-3 text-xs text-bloom-subtle">
        Customers can start bookings every{" "}
        <strong className="text-bloom-text">
          {slotIntervalMinutes ?? 30} minutes
        </strong>
        , with up to{" "}
        <strong className="text-bloom-text">{capacity || 1}</strong>{" "}
        appointments running at the same time.
      </div>
    </section>
  );
}
