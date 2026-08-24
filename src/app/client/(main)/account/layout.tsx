import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AccountSidebarContent } from "./components/accountSidebarContent";
import type { ReactNode } from "react";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-[calc(100svh-89px)] overflow-hidden bg-bloom-bg lg:rounded-sm">
      <SidebarProvider className="min-h-[calc(100svh-89px)] items-stretch">
        <Sidebar
          collapsible="none"
          className="hidden h-auto self-stretch border-r border-bloom-border bg-bloom-soft lg:flex"
        >
          <AccountSidebarContent />
        </Sidebar>

        <SidebarInset className="bg-bloom-bg">{children}</SidebarInset>
      </SidebarProvider>
    </div>
  );
}
