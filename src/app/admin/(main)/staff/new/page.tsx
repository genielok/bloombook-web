"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { createStaff } from "@/app/api/admins/admin";
import { StaffForm } from "../staff-form";

export default function AdminNewStaffPage() {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <Link
        href="/admin/staff"
        className="mb-4 inline-flex text-[13px] font-semibold text-bloom-accent-dark hover:underline"
      >
        ← All staff
      </Link>

      <StaffForm
        submitLabel="Create staff member"
        onSubmit={async (values) => {
          await createStaff(values);
          router.push("/admin/staff");
        }}
        onCancel={() => router.push("/admin/staff")}
      />
    </div>
  );
}
