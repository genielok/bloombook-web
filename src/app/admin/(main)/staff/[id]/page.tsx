"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  deleteStaff,
  editStaff,
  getStaffList,
} from "@/app/api/admins/admin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { AdminStaff } from "../../components/staff-data";
import { StaffForm } from "../staff-form";

export default function AdminStaffDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [staff, setStaff] = useState<AdminStaff | null>();
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    void getStaffList()
      .then(({ data }) => {
        setStaff(data.find((member) => member.id === params.id) ?? null);
      })
      .catch(() => setStaff(null));
  }, [params.id]);

  if (staff === undefined) {
    return <p className="text-sm text-bloom-subtle">Loading staff member…</p>;
  }

  if (staff === null) {
    return (
      <div className="mx-auto w-full max-w-[1440px]">
        <p className="text-sm text-bloom-subtle">Staff member not found.</p>
        <Button asChild variant="link" className="mt-2 h-auto px-0">
          <Link href="/admin/staff">← All staff</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <Link
        href="/admin/staff"
        className="mb-4 inline-flex text-[13px] font-semibold text-bloom-accent-dark hover:underline"
      >
        ← All staff
      </Link>

      <div className="mb-4 flex max-w-[560px] items-center justify-between">
        <h2 className="font-display text-xl">Edit staff member</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="border-[#d8a49d] bg-white text-[13px] font-semibold text-[#b0453a] shadow-none"
            >
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {staff.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes the staff member from your team and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={async () => {
                  setDeleteError("");
                  try {
                    await deleteStaff(staff.id);
                    router.push("/admin/staff");
                  } catch (error) {
                    setDeleteError(
                      error instanceof Error
                        ? error.message
                        : "Unable to delete this staff member.",
                    );
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {deleteError && (
        <p role="alert" className="mb-4 max-w-[560px] text-sm text-red-500">
          {deleteError}
        </p>
      )}

      <StaffForm
        key={staff.id}
        defaultValues={staff}
        submitLabel="Save changes"
        onSubmit={async (values) => {
          await editStaff({ id: staff.id, ...values });
          router.push("/admin/staff");
        }}
        onCancel={() => router.push("/admin/staff")}
      />
    </div>
  );
}
