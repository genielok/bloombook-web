import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { StaffFormValues } from "../components/staff-data";

export function StaffForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  defaultValues?: StaffFormValues;
  submitLabel: string;
  onSubmit: (values: StaffFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    const data = new FormData(event.currentTarget);

    try {
      await onSubmit({
        name: String(data.get("name")).trim(),
        email: String(data.get("email")).trim(),
        phone: String(data.get("phone")).trim(),
        role: String(data.get("role")).trim(),
        bio: String(data.get("bio")).trim(),
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save this staff member.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-[560px] rounded-[10px] border border-bloom-border bg-white px-[26px] py-6"
    >
      <div className="flex flex-col gap-4">
        <FormField label="Full name" htmlFor="name">
          <Input
            id="name"
            name="name"
            required
            defaultValue={defaultValues?.name}
            placeholder="e.g. Nora Fischer"
            className="h-10 border-bloom-border bg-white text-sm shadow-none"
          />
        </FormField>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <FormField label="Email" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={defaultValues?.email}
              placeholder="name@petalstudio.com"
              className="h-10 border-bloom-border bg-white text-sm shadow-none"
            />
          </FormField>
          <FormField label="Phone" htmlFor="phone">
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={defaultValues?.phone}
              placeholder="+49 …"
              className="h-10 border-bloom-border bg-white text-sm shadow-none"
            />
          </FormField>
        </div>

        <FormField label="Role" htmlFor="role">
          <Input
            id="role"
            name="role"
            required
            defaultValue={defaultValues?.role}
            placeholder="e.g. Nail Technician"
            className="h-10 border-bloom-border bg-white text-sm shadow-none"
          />
        </FormField>

        <FormField label="Bio" htmlFor="bio">
          <Textarea
            id="bio"
            name="bio"
            defaultValue={defaultValues?.bio}
            placeholder="Short bio shown on the studio page…"
            className="min-h-[82px] resize-y border-bloom-border bg-white text-sm shadow-none"
          />
        </FormField>

        {error && (
          <p role="alert" className="text-sm text-red-500">
            {error}
          </p>
        )}

        <div className="mt-1.5 flex gap-2.5">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-bloom-text text-[13px] font-semibold text-bloom-bg hover:bg-bloom-text/90"
          >
            {isSubmitting ? "Saving…" : submitLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onCancel}
            className="border-bloom-border bg-white text-[13px] font-semibold shadow-none"
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-normal text-bloom-subtle">
        {label}
      </Label>
      {children}
    </div>
  );
}
