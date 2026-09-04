"use client";

import type { SubmitEventHandler } from "react";
import { useForm } from "react-hook-form";

import { AdminFormField, AdminInput } from "../../components/admin-form";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import type { AccountFormValues } from "../page";
import { useDemoMode } from "../../components/demo-mode-context";

type Params = {
  accountInfo: AccountFormValues;
  onSave: (values: AccountFormValues) => Promise<void>;
};

export function AccountSettingsForm({ accountInfo, onSave }: Params) {
  const isDemo = useDemoMode();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>({
    values: accountInfo,
  });

  const submit: SubmitEventHandler<HTMLFormElement> = handleSubmit(
    async (data) => {
      if (isDemo) return;
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
          {isDemo && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Account settings are locked so everyone can keep using the demo
              login.
            </p>
          )}
          <AdminFormField label="Full name" htmlFor="account-name" required>
            <AdminInput
              required
              disabled={isDemo}
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
              disabled={isDemo}
            />
            {errors.email && (
              <span role="alert" className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </AdminFormField>
          <div>
            <Button type="submit" disabled={isSubmitting || isDemo}>
              {isSubmitting && <Spinner data-icon="inline-start" />}
              {isDemo
                ? "Locked in Demo Mode"
                : isSubmitting
                  ? "Saving..."
                  : "Save changes"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
