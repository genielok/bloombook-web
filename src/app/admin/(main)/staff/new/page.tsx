"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminNewStaffPage() {
  const router = useRouter();

  const createStaff = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/admin/staff");
  };

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <Link
        href="/admin/staff"
        className="mb-4 inline-flex text-[13px] font-semibold text-bloom-accent-dark hover:underline"
      >
        ← All staff
      </Link>

      <form
        onSubmit={createStaff}
        className="max-w-[560px] rounded-[10px] border border-bloom-border bg-white px-[26px] py-6"
      >
        <div className="flex flex-col gap-4">
          <FormField label="Full name" htmlFor="name">
            <Input
              id="name"
              name="name"
              required
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
                placeholder="name@petalstudio.com"
                className="h-10 border-bloom-border bg-white text-sm shadow-none"
              />
            </FormField>
            <FormField label="Phone" htmlFor="phone">
              <Input
                id="phone"
                name="phone"
                type="tel"
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
              placeholder="e.g. Nail Technician"
              className="h-10 border-bloom-border bg-white text-sm shadow-none"
            />
          </FormField>

          <FormField label="Bio" htmlFor="bio">
            <Textarea
              id="bio"
              name="bio"
              placeholder="Short bio shown on the studio page…"
              className="min-h-[82px] resize-y border-bloom-border bg-white text-sm shadow-none"
            />
          </FormField>

          <p className="text-xs text-bloom-subtle">
            Services and working hours can be configured after the staff member
            is created.
          </p>

          <div className="mt-1.5 flex gap-2.5">
            <Button
              type="submit"
              className="bg-bloom-text text-[13px] font-semibold text-bloom-bg hover:bg-bloom-text/90"
            >
              Create staff member
            </Button>
            <Button
              asChild
              type="button"
              variant="outline"
              className="border-bloom-border bg-white text-[13px] font-semibold shadow-none"
            >
              <Link href="/admin/staff">Cancel</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
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
