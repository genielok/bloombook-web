"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";

import type { StudioSettings } from "@/app/api/admins/admin";
import { Switch } from "@/components/ui/switch";
import { AdminInput } from "../../components/admin-form";

const DAYS_OF_WEEK: Record<number, string> = {
  0: "Monday",
  1: "Tuesday",
  2: "Wednesday",
  3: "Thursday",
  4: "Friday",
  5: "Saturday",
  6: "Sunday",
};
export function BusinessHourSettingsForm() {
  const {
    register,
    control,
    getValues,
    formState: { errors },
  } = useFormContext<StudioSettings>();

  const businessHours =
    useWatch({
      control,
      name: "businessHours",
    }) ?? [];

  return (
    <section className="mt-6 border-t border-bloom-border pt-5">
      <div>
        <h2 className="text-sm font-semibold text-bloom-text">
          Business hours
        </h2>
        <p className="mt-1 text-xs text-bloom-subtle">
          Set when customers can book appointments.
        </p>
      </div>

      <div className="mt-4">
        {businessHours?.map((hours, index) => {
          const hourErrors = errors.businessHours?.[index];

          return (
            <div
              key={hours.dayOfWeek}
              className="flex min-h-[54px] flex-wrap items-center gap-3 border-b border-[#f5efe8] py-2 last:border-0 sm:flex-nowrap sm:gap-3.5"
            >
              <span className="w-[90px] shrink-0 text-[13px] font-semibold">
                {DAYS_OF_WEEK[hours.dayOfWeek]}
              </span>

              <Controller
                name={`businessHours.${index}.isOpen`}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label={`${field.value ? "Close" : "Open"} ${hours.day}`}
                  />
                )}
              />

              {hours.isOpen ? (
                <div className="flex  items-center gap-2">
                  <AdminInput
                    compact
                    type="time"
                    step={"600"}
                    aria-label={`${hours.day} opening time`}
                    {...register(`businessHours.${index}.startTime`, {
                      validate: (value) =>
                        !getValues(`businessHours.${index}.isOpen`) ||
                        Boolean(value) ||
                        "Opening time is required",
                    })}
                    aria-invalid={Boolean(hourErrors?.startTime)}
                    className="h-8 w-[112px] px-2.5"
                  />
                  <span className="text-[13px] text-bloom-subtle">–</span>
                  <AdminInput
                    compact
                    type="time"
                    step={600}
                    aria-label={`${hours.day} closing time`}
                    {...register(`businessHours.${index}.endTime`, {
                      validate: (value) => {
                        if (!getValues(`businessHours.${index}.isOpen`)) {
                          return true;
                        }
                        if (!value) return "Closing time is required";

                        return (
                          value >
                            getValues(`businessHours.${index}.startTime`) ||
                          "Closing time must be after opening time"
                        );
                      },
                    })}
                    aria-invalid={Boolean(hourErrors?.endTime)}
                    className="h-8 w-[112px] px-2.5"
                  />
                  {(hourErrors?.startTime || hourErrors?.endTime) && (
                    <p role="alert" className="w-full text-xs text-red-500">
                      {hourErrors.startTime?.message ??
                        hourErrors.endTime?.message}
                    </p>
                  )}
                </div>
              ) : (
                <span className="text-[13px] text-bloom-subtle">Closed</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
