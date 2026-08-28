"use client";

import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { AdminTab } from "../components/admin-form";
import { AccountSettingsForm } from "./components/account-settings-form";
import { StudioSettingsForm } from "./components/studio-settings-form";
import { useEffect, useState } from "react";
import {
  getCurrentAdminUser,
  getStudioInfo,
  handleUpdateAdminAccount,
  type StudioSettings,
  updateStudioSettings,
} from "@/app/api/admins/admin";
import { StudioBasic } from "@/app/api/clients/types";
import { inistialStudioValues } from "./const";
import Toast from "@/components/Toast";

export type AccountFormValues = {
  name: string;
  email: string;
};

export default function AdminSettingsPage() {
  const [showSuccess, setShowSuccess] = useState(false);
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
      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving account info:", error);
    }
  };

  const handleSaveStudioInfo = async (values: StudioSettings) => {
    try {
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

      const { data } = await updateStudioSettings(normalizedValues);
      setStudioInfo(data);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving studio info:", error);
    }
  };

  useEffect(() => {
    let cancelled = false;

    void Promise.all([getCurrentAdminUser(), getStudioInfo()])
      .then(([accountResponse, studioResponse]) => {
        if (cancelled) return;

        setAccountInfo({
          email: accountResponse.data.email,
          name: accountResponse.data.name,
        });
        setStudioInfo({
          ...inistialStudioValues,
          ...studioResponse.data,
          businessHours:
            studioResponse.data.businessHours ??
            inistialStudioValues.businessHours,
        });
      })
      .catch((error) => {
        console.error("Failed to fetch settings:", error);
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
          <StudioSettingsForm
            studioInfo={studioInfo}
            onSave={handleSaveStudioInfo}
          />
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
        message="Studio information updated"
        description="Your changes have been saved."
        duration={2000}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
