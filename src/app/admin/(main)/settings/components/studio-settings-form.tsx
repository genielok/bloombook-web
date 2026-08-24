"use client";

import { useState, type FormEventHandler } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AdminFormField, AdminInput } from "../../components/admin-form";
import { FilterSelect } from "../../components/filterSelect";
import { BusinessHour, CategoryArray, initialBusinessHours } from "../const";
import { SettingsSaveButton } from "./settings-ui";

export function StudioSettingsForm() {
  const [businessHours, setBusinessHours] =
    useState<BusinessHour[]>(initialBusinessHours);
  const [studioCategory, setStudioCategory] = useState<string>(
    CategoryArray[0],
  );
  const [saved, setSaved] = useState(false);

  const submit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const updateHours = (
    index: number,
    field: "isOpen" | "open" | "close",
    value: boolean | string,
  ) => {
    setBusinessHours((current) =>
      current.map((hours, itemIndex) =>
        itemIndex === index ? { ...hours, [field]: value } : hours,
      ),
    );
    setSaved(false);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-[10px] border border-bloom-border bg-white px-[26px] py-6"
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-3.5 sm:grid-cols-2">
          <AdminFormField label="Studio name" htmlFor="studio-name" required>
            <AdminInput
              id="studio-name"
              name="studioName"
              defaultValue="Petal Studio"
              required
            />
          </AdminFormField>

          <AdminFormField label="Category" htmlFor="studio-category" required>
            <FilterSelect
              id="studio-category"
              name="category"
              required
              label="Select category"
              value={studioCategory}
              items={CategoryArray}
              onChange={setStudioCategory}
              className="w-full"
            />
          </AdminFormField>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-[2fr_1fr]">
          <AdminFormField label="City" htmlFor="studio-city" required>
            <AdminInput
              id="studio-city"
              name="city"
              required
              defaultValue="Berlin"
            />
          </AdminFormField>
          <AdminFormField label="Address" htmlFor="studio-address" required>
            <AdminInput
              id="studio-address"
              name="address"
              required
              defaultValue="Torstraße 114"
            />
          </AdminFormField>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <AdminFormField label="Phone" htmlFor="studio-phone" required>
            <AdminInput
              id="studio-phone"
              name="phone"
              type="tel"
              defaultValue="+49 30 5551 2290"
              required
            />
          </AdminFormField>
          <AdminFormField label="Email" htmlFor="studio-email" required>
            <AdminInput
              id="studio-email"
              name="email"
              type="email"
              defaultValue="hello@petalstudio.com"
              required
            />
          </AdminFormField>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <AdminFormField
            label="Simultaneous booking capacity"
            htmlFor="studio-capacity"
            required
          >
            <AdminInput
              id="studio-capacity"
              name="capacity"
              type="number"
              min={1}
              step={1}
              defaultValue={1}
              required
            />
          </AdminFormField>
          <AdminFormField
            label="Slot interval (minutes)"
            htmlFor="studio-slot-interval"
            required
          >
            <AdminInput
              id="studio-slot-interval"
              name="slot_interval_minutes"
              type="number"
              min={10}
              step={5}
              defaultValue={30}
              required
            />
          </AdminFormField>
        </div>

        <AdminFormField label="Description" htmlFor="studio-description">
          <Textarea
            id="studio-description"
            name="description"
            defaultValue="An intimate nail and beauty studio in Mitte specializing in gel manicures, spa pedicures and lash treatments."
            className="min-h-20 resize-y border-bloom-border bg-white text-sm shadow-none focus-visible:border-bloom-accent focus-visible:ring-bloom-accent/20"
          />
        </AdminFormField>

        <div className="border-t border-bloom-border pt-5">
          <h2 className="text-sm font-semibold text-bloom-text">
            Business hours
          </h2>
          <p className="mt-1 text-xs text-bloom-subtle">
            Set when customers can book appointments.
          </p>
        </div>

        <div>
          {businessHours?.map((hours, index) => (
            <div
              key={hours.day}
              className="flex min-h-[54px] flex-wrap items-center gap-3 border-b border-[#f5efe8] py-2 last:border-0 sm:flex-nowrap sm:gap-3.5"
            >
              <input
                type="hidden"
                name={`business_hours.${index}.day`}
                value={hours.day}
              />
              <input
                type="hidden"
                name={`business_hours.${index}.is_open`}
                value={String(hours.isOpen)}
              />
              <span className="w-[90px] shrink-0 text-[13px] font-semibold">
                {hours.day}
              </span>
              <Button
                type="button"
                role="switch"
                aria-checked={hours.isOpen}
                aria-label={`${hours.isOpen ? "Close" : "Open"} ${hours.day}`}
                variant="ghost"
                onClick={() => updateHours(index, "isOpen", !hours.isOpen)}
                className={`relative h-5 w-9 shrink-0 rounded-full p-0 ${
                  hours.isOpen
                    ? "bg-[#7bae8a] hover:bg-[#7bae8a]"
                    : "bg-[#e4e4e7] hover:bg-[#e4e4e7]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${
                    hours.isOpen ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </Button>

              {hours.isOpen ? (
                <div className="flex items-center gap-2">
                  <AdminInput
                    compact
                    type="time"
                    name={`business_hours.${index}.open`}
                    aria-label={`${hours.day} opening time`}
                    value={hours.startTime}
                    onChange={(event) =>
                      updateHours(index, "open", event.target.value)
                    }
                    className="h-8 w-[112px] px-2.5"
                  />
                  <span className="text-[13px] text-bloom-subtle">–</span>
                  <AdminInput
                    compact
                    type="time"
                    name={`business_hours.${index}.close`}
                    aria-label={`${hours.day} closing time`}
                    value={hours.endTime}
                    onChange={(event) =>
                      updateHours(index, "close", event.target.value)
                    }
                    className="h-8 w-[112px] px-2.5"
                  />
                </div>
              ) : (
                <span className="text-[13px] text-bloom-subtle">Closed</span>
              )}
            </div>
          ))}
        </div>

        <div className="pt-1">
          <SettingsSaveButton saved={saved}>Save changes</SettingsSaveButton>
        </div>
      </div>
    </form>
  );
}
