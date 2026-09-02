"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";
import { getAssetUrl } from "@/lib/func";
import { useStoredUser } from "@/hooks/use-stored-user";

const accountNavItems = [
  {
    label: "Bookings",
    href: "/client/account/booking",
    aliases: ["/client/account/manageBooking"],
  },
  // {
  //   label: "Payment methods",
  //   href: "/client/account/payment",
  // },
  {
    label: "Profile",
    href: "/client/account/profile",
  },
  // {
  //   label: "Setting",
  //   href: "/client/account/setting",
  // },
];

function isActivePath(
  pathname: string,
  item: (typeof accountNavItems)[number],
) {
  const paths = [item.href, ...(item.aliases ?? [])];

  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function AccountSidebarContent() {
  const pathname = usePathname();
  const user = useStoredUser();

  return (
    <>
      <SidebarHeader className="px-[22px] py-8 pb-[22px]">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={getAssetUrl(user?.avatarImg)}
              alt={user?.name ?? "Account"}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-[15px] font-semibold">{user?.name}</div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-[22px]" />
      <SidebarContent className="px-[14px] py-[18px]">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="sr-only">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {accountNavItems.map((item) => {
                const isActive = isActivePath(pathname, item);
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={
                        isActive
                          ? "!bg-bloom-text !font-semibold !text-bloom-bg"
                          : "text-[#4a4540]"
                      }
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <LogOutIcon /> Sign out
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </>
  );
}
