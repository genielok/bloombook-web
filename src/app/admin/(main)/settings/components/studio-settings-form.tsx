"use client";

import {
  Controller,
  FormProvider,
  useForm,
  type SubmitHandler,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { AdminFormField, AdminInput } from "../../components/admin-form";
import { FilterSelect } from "../../components/filterSelect";
import { CategoryArray, initialBusinessHours } from "../const";
import type { StudioBasic } from "@/app/api/clients/types";
import type { StudioSettings } from "@/app/api/admins/admin";
import { BusinessHourSettingsForm } from "./businessHour-settings-form";
import { BookingSettingsForm } from "./booking-settings-form";
import { StudioImageUpload } from "./studio-image-upload";
import { useDemoMode } from "../../components/demo-mode-context";

export function StudioSettingsForm({
  studioInfo,
  onSave,
  isSetup = false,
}: {
  studioInfo: StudioBasic;
  onSave: (values: StudioSettings) => Promise<void>;
  isSetup?: boolean;
}) {
  const isDemo = useDemoMode();
  const methods = useForm<StudioSettings>({
    values: {
      name: studioInfo.name,
      category: studioInfo.category,
      city: studioInfo.city,
      address: studioInfo.address,
      phone: studioInfo.phone,
      email: studioInfo.email,
      description: studioInfo.description,
      imgUrl: studioInfo.imgUrl,
      capacity: studioInfo.capacity,
      slotIntervalMinutes: studioInfo.slotIntervalMinutes,
      businessHours: studioInfo.businessHours ?? initialBusinessHours,
    },
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const submit: SubmitHandler<StudioSettings> = async (data) => {
    try {
      await onSave(data);
    } catch (error) {
      console.log("Error updating studio settings:", error);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(submit)}
          className="rounded-[10px] border border-bloom-border bg-white px-[26px] py-6"
        >
        <div>
          <h2 className="text-sm font-semibold text-bloom-text">
            {isSetup ? "Set up your studio" : "Studio information"}
          </h2>
          <p className="mt-1 text-xs text-bloom-subtle">
            {isSetup
              ? "Add your studio details before using the admin dashboard."
              : "Details customers see when they visit your studio page."}
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <Controller
            name="imgUrl"
            control={control}
            render={({ field }) => (
              <StudioImageUpload
                value={field.value}
                disabled={isSubmitting || isDemo}
                disabledReason={
                  isDemo ? "Image uploads are locked in Demo Mode." : undefined
                }
                onChange={field.onChange}
              />
            )}
          />

          <div className="grid gap-3.5 sm:grid-cols-2">
            <AdminFormField label="Studio name" htmlFor="studio-name" required>
              <AdminInput
                id="studio-name"
                {...register("name", {
                  required: "Studio name is required",
                  minLength: {
                    value: 2,
                    message: "Studio name must be at least 2 characters",
                  },
                })}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && (
                <p role="alert" className="text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </AdminFormField>

            <AdminFormField label="Category" htmlFor="studio-category" required>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <FilterSelect
                    id="studio-category"
                    name={field.name}
                    required
                    label="Select category"
                    value={field.value}
                    items={CategoryArray}
                    onChange={field.onChange}
                    getItemLabel={(value) =>
                      value.charAt(0).toUpperCase() + value.slice(1)
                    }
                    className="h-10 w-full"
                  />
                )}
              />
              {errors.category && (
                <p role="alert" className="text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </AdminFormField>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-[1fr_2fr]">
            <AdminFormField label="City" htmlFor="studio-city" required>
              <AdminInput
                id="studio-city"
                {...register("city", { required: "City is required" })}
                aria-invalid={Boolean(errors.city)}
              />
              {errors.city && (
                <p role="alert" className="text-sm text-red-500">
                  {errors.city.message}
                </p>
              )}
            </AdminFormField>

            <AdminFormField label="Address" htmlFor="studio-address" required>
              <AdminInput
                id="studio-address"
                {...register("address", { required: "Address is required" })}
                aria-invalid={Boolean(errors.address)}
              />
              {errors.address && (
                <p role="alert" className="text-sm text-red-500">
                  {errors.address.message}
                </p>
              )}
            </AdminFormField>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <AdminFormField label="Phone" htmlFor="studio-phone" required>
              <AdminInput
                id="studio-phone"
                type="tel"
                {...register("phone", { required: "Phone is required" })}
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone && (
                <p role="alert" className="text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </AdminFormField>

            <AdminFormField label="Email" htmlFor="studio-email" required>
              <AdminInput
                id="studio-email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <p role="alert" className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </AdminFormField>
          </div>

          <AdminFormField label="Description" htmlFor="studio-description">
            <Textarea
              id="studio-description"
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "Description cannot exceed 500 characters",
                },
              })}
              aria-invalid={Boolean(errors.description)}
              className="min-h-20 resize-y border-bloom-border bg-white text-sm shadow-none focus-visible:border-bloom-accent focus-visible:ring-bloom-accent/20"
            />
            {errors.description && (
              <p role="alert" className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </AdminFormField>
        </div>

        <BusinessHourSettingsForm />
        <BookingSettingsForm />

        <div className="mt-6">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner data-icon="inline-start" />}
            {isSubmitting
              ? "Saving..."
              : isSetup
                ? "Create studio"
                : "Save studio settings"}
          </Button>
        </div>
        </form>
      </FormProvider>
    </>
  );
}
