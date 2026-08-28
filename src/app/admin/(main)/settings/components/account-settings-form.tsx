"use client";

import { SubmitEventHandler, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { AdminFormField, AdminInput } from "../../components/admin-form";
import { Spinner } from "@/components/ui/spinner";
import { handleUpdateAdminAccount } from "@/app/api/admins/admin";
import { Button } from "@/components/ui/button";
import Toast from "@/components/Toast";
import type { AccountFormValues } from "../page";

type Params = {
  accountInfo: AccountFormValues;
  onSave: (values: AccountFormValues) => Promise<void>;
};

export function AccountSettingsForm({ accountInfo, onSave }: Params) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>({
    values: accountInfo,
  });

  const submit: SubmitEventHandler<HTMLFormElement> = handleSubmit(
    async (data) => {
      try {
        await onSave(data);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    (errors) => {
      console.error("Validation error", errors);
    },
  );

  return (
    <>
      <form
        onSubmit={submit}
        className="rounded-[10px] border border-bloom-border bg-white px-[26px] py-6"
      >
        <div className="flex flex-col gap-4">
          <AdminFormField label="Full name" htmlFor="account-name" required>
            <AdminInput
              required
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <span role="alert" className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </AdminFormField>
          <AdminFormField label="Email" htmlFor="account-email" required>
            <AdminInput
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              required
            />
            {errors.email && (
              <span role="alert" className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </AdminFormField>
          <div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner data-icon="inline-start" />}
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
