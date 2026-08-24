"use client";

import { useState, type FormEventHandler } from "react";

import { AdminFormField, AdminInput } from "../../components/admin-form";
import { SettingsSaveButton } from "./settings-ui";

export function AccountSettingsForm() {
  const [saved, setSaved] = useState(false);

  const submit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-[10px] border border-bloom-border bg-white px-[26px] py-6"
    >
      <div className="flex flex-col gap-4">
        <AdminFormField label="Full name" htmlFor="account-name" required>
          <AdminInput
            id="account-name"
            name="fullName"
            defaultValue="Mara Voss"
            required
          />
        </AdminFormField>
        <AdminFormField label="Email" htmlFor="account-email" required>
          <AdminInput
            id="account-email"
            name="email"
            type="email"
            defaultValue="mara@petalstudio.com"
            required
          />
        </AdminFormField>
        <AdminFormField label="New password" htmlFor="account-password">
          <AdminInput
            id="account-password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </AdminFormField>

        <div>
          <SettingsSaveButton saved={saved}>Save account</SettingsSaveButton>
        </div>
      </div>
    </form>
  );
}
