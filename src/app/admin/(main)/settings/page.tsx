"use client";

import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { AdminTab } from "../components/admin-form";
import { AccountSettingsForm } from "./components/account-settings-form";
import { StudioSettingsForm } from "./components/studio-settings-form";
import { useEffect, useState } from "react";
import {
  createStudio,
  getCurrentAdminUser,
  getStudioInfo,
  handleUpdateAdminAccount,
  type StudioSettings,
  updateStudioSettings,
} from "@/app/api/admins/admin";
import { ApiError } from "@/app/lib/http";
import { StudioBasic } from "@/app/api/clients/types";
import { inistialStudioValues } from "./const";
import Toast from "@/components/Toast";
import { useRouter } from "next/navigation";
import { ADMIN_STUDIO_CREATED_EVENT } from "../components/admin-shell";

export type AccountFormValues = {
  name: string;
  email: string;
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [hasStudio, setHasStudio] = useState<boolean | null>(null);
  const [accountInfo, setAccountInfo] = useState<AccountFormValues>({
    name: "",
    email: "",
  });
  const [studioInfo, setStudioInfo] =
    useState<StudioBasic>(inistialStudioValues);

  const handleSaveAccountInfo = async (values: AccountFormValues) => {
    try {
      const { data } = await handleUpdateAdminAccount(values);
      setAccountInfo(data);
      setSuccessMessage("Account information updated");
      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving account info:", error);
    }
  };

  const handleSaveStudioInfo = async (values: StudioSettings) => {
    try {
      const isCreating = hasStudio === false;
      const normalizedValues: StudioSettings = {
        ...values,
        category: values.category.toLowerCase() as StudioSettings["category"],
        businessHours: values.businessHours.map((hours, index) => ({
          ...hours,
          dayOfWeek: index,
          startTime: hours.startTime || "09:00",
          endTime: hours.endTime || "17:00",
        })),
      };

      const { data } = isCreating
        ? await createStudio(normalizedValues)
        : await updateStudioSettings(normalizedValues);
      setStudioInfo(data);
      setHasStudio(true);
      setSuccessMessage(
        isCreating ? "Studio created" : "Studio information updated",
      );
      setShowSuccess(true);

      if (isCreating) {
        window.dispatchEvent(new Event(ADMIN_STUDIO_CREATED_EVENT));
        router.replace("/admin");
      }
    } catch (error) {
      console.error("Error saving studio info:", error);
    }
  };

  useEffect(() => {
    let cancelled = false;

    void getCurrentAdminUser()
      .then((accountResponse) => {
        if (cancelled) return;
        setAccountInfo({
          email: accountResponse.data.email,
          name: accountResponse.data.name,
        });
      })
      .catch((error) => {
        console.error("Failed to fetch account settings:", error);
      });

    void getStudioInfo({ showErrorToast: false })
      .then((studioResponse) => {
        if (cancelled) return;
        setHasStudio(true);
        setStudioInfo({
          ...inistialStudioValues,
          ...studioResponse.data,
          businessHours:
            studioResponse.data.businessHours ??
            inistialStudioValues.businessHours,
        });
      })
      .catch((error: unknown) => {
        if (cancelled) return;

        if (error instanceof ApiError && error.status === 404) {
          setHasStudio(false);
          setStudioInfo(inistialStudioValues);
          return;
        }

        console.error("Failed to fetch studio settings:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <Tabs defaultValue="studio">
        <TabsList
          variant="line"
          className="h-auto w-full justify-start gap-6 rounded-none border-b border-bloom-border p-0"
        >
          <AdminTab value="studio">Studio</AdminTab>
          <AdminTab value="account">Account</AdminTab>
        </TabsList>

        <TabsContent
          value="studio"
          className="mt-[22px] flex max-w-[720px] flex-col gap-5"
        >
          {hasStudio === null ? (
            <div className="rounded-[10px] border border-bloom-border bg-white px-6 py-10 text-center text-sm text-bloom-subtle">
              Loading studio settings…
            </div>
          ) : (
            <StudioSettingsForm
              studioInfo={studioInfo}
              onSave={handleSaveStudioInfo}
              isSetup={!hasStudio}
            />
          )}
        </TabsContent>

        <TabsContent value="account" className="mt-[22px] max-w-[480px]">
          <AccountSettingsForm
            accountInfo={accountInfo}
            onSave={handleSaveAccountInfo}
          />
        </TabsContent>
      </Tabs>
      <Toast
        visible={showSuccess}
        type="success"
        message={successMessage}
        description="Your changes have been saved."
        duration={2000}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
