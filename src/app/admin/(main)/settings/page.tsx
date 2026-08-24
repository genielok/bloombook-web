"use client";

import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { AdminTab } from "../components/admin-form";
import { AccountSettingsForm } from "./components/account-settings-form";
import { StudioSettingsForm } from "./components/studio-settings-form";

export default function AdminSettingsPage() {
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

        <TabsContent value="studio" className="mt-[22px] max-w-[640px]">
          <StudioSettingsForm />
        </TabsContent>

        <TabsContent value="account" className="mt-[22px] max-w-[480px]">
          <AccountSettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
