"use client";

import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Tags,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { logoutAdmin } from "@/app/api/admins/admin";

type NavigationItem = {
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
};

const navigation: NavigationItem[] = [
  {
    title: "Dashboard",
    subtitle: "Overview of today and this month",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Bookings",
    subtitle: "Manage customer bookings",
    href: "/admin/bookings",
    icon: ClipboardCheck,
  },
  {
    title: "Calendar",
    subtitle: "View and manage the studio schedule",
    href: "/admin/calendar",
    icon: CalendarDays,
  },
  {
    title: "Services",
    subtitle: "Manage your bookable services",
    href: "/admin/services",
    icon: Tags,
  },
  {
    title: "Staff",
    subtitle: "Manage your team members",
    href: "/admin/staff",
    icon: Users,
  },
  {
    title: "Settings",
    subtitle: "Manage studio information, hours and account",
    href: "/admin/settings",
    icon: Settings,
  },
];

function isActive(pathname: string, href: string) {
  return href === "/admin"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

function AdminLogoutButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();

  const logout = async () => {
    try {
      await logoutAdmin();
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  };

  return (
    <button type="button" onClick={logout} className={className}>
      {children}
    </button>
  );
}

function getPageMeta(pathname: string) {
  return (
    navigation.find((item) => isActive(pathname, item.href)) ?? navigation[0]
  );
}

function AdminSidebar({ pathname }: { pathname: string }) {
  return (
    <Sidebar
      collapsible="icon"
      className="border-bloom-border bg-white text-bloom-text"
    >
      <SidebarHeader className="px-3 pt-5 pb-3">
        <Link
          href="/admin"
          className="flex h-9 items-center gap-2 overflow-hidden px-2"
        >
          <span className="font-display text-xl leading-none tracking-[-0.01em] group-data-[collapsible=icon]:hidden">
            Bloombook
          </span>
          <Badge className="h-[22px] rounded-md bg-[#f4ebe2] px-2 text-[10px] font-bold tracking-[0.04em] text-bloom-accent-dark uppercase group-data-[collapsible=icon]:hidden">
            Admin
          </Badge>
          <span className="hidden font-display text-xl group-data-[collapsible=icon]:block">
            B
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-3 py-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(pathname, item.href)}
                    className="h-9 gap-2.5 rounded-lg px-2.5 text-bloom-subtle hover:bg-[#f7f2ec] hover:text-bloom-accent-dark data-active:bg-[#f4ebe2] data-active:font-semibold data-active:text-bloom-accent-dark [&_svg]:size-[17px]"
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2 px-3 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Log out"
              className="h-9 gap-2.5 px-2.5 text-bloom-subtle hover:bg-[#f7f2ec] hover:text-bloom-text [&_svg]:size-[17px]"
            >
              <AdminLogoutButton>
                <LogOut />
                <span>Log out</span>
              </AdminLogoutButton>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator className="mx-0 bg-[#f0e9e1]" />
        <div className="flex min-w-0 items-center gap-2.5 px-2 pt-1 group-data-[collapsible=icon]:px-0">
          <Avatar className="size-8 bg-bloom-text">
            <AvatarFallback className="bg-bloom-text text-xs font-bold text-bloom-bg">
              MV
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-[13px] font-semibold text-[#18181b]">
              Mara Voss
            </p>
            <p className="truncate text-xs text-bloom-subtle">Studio Owner</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function AdminHeader({ pathname }: { pathname: string }) {
  const meta = getPageMeta(pathname);

  return (
    <header className="flex min-h-[66px] shrink-0 items-center gap-3 border-b border-bloom-border bg-white px-4 md:px-7">
      <SidebarTrigger className="size-8 text-bloom-subtle md:hidden" />
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold leading-tight text-[#18181b]">
          {meta.title}
        </h1>
        <p className="mt-0.5 hidden truncate text-xs leading-tight text-bloom-subtle sm:block">
          {meta.subtitle}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3.5">
        <Badge className="hidden h-7 gap-1.5 border-0 bg-[#f4ebe2] px-3 text-xs font-semibold text-bloom-accent-dark lg:inline-flex">
          <span className="size-1.5 rounded-full bg-bloom-accent" />
          Atelier Bloom
        </Badge>
        <div className="relative hidden w-[220px] xl:block">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-bloom-subtle" />
          <Input
            aria-label="Quick search"
            placeholder="Quick search…"
            className="h-8 border-bloom-border bg-[#faf6f1] pl-9 text-[13px] shadow-none placeholder:text-bloom-subtle focus-visible:border-bloom-accent focus-visible:ring-bloom-accent/20"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Notifications"
          className="relative size-8 border-bloom-border bg-[#faf6f1] text-bloom-subtle shadow-none hover:bg-[#f4ebe2] hover:text-bloom-text"
        >
          <Bell className="size-[15px]" />
          <span className="absolute top-0 right-0 size-2 rounded-full border-2 border-white bg-bloom-accent" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full p-0"
            >
              <Avatar className="size-8 bg-bloom-text">
                <AvatarFallback className="bg-bloom-text text-[11px] font-bold text-bloom-bg">
                  MV
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Open account menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <span className="block text-sm text-bloom-text">Mara Voss</span>
              <span className="block font-normal text-bloom-subtle">
                Studio Owner
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings" className="gap-2">
                <UserRound /> Account settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <AdminLogoutButton className="flex w-full items-center gap-2">
                <LogOut /> Log out
              </AdminLogoutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login" || pathname === "/admin/register") {
    return children;
  }

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "14.75rem",
            "--sidebar-width-icon": "3.5rem",
          } as CSSProperties
        }
        className="h-svh min-h-0 bg-[#f7f2ec] text-bloom-text"
      >
        <AdminSidebar pathname={pathname} />
        <SidebarInset className="h-svh min-w-0 overflow-hidden bg-[#f7f2ec]">
          <AdminHeader pathname={pathname} />
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
