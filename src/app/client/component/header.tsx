"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgeCheckIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAssetUrl } from "@/lib/func";
import {
  notifyStoredUserChanged,
  useStoredUser,
} from "@/hooks/use-stored-user";

export function HeaderComponent(props: { children?: ReactNode }) {
  const user = useStoredUser();
  const router = useRouter();

  const handleSignout = async () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      notifyStoredUserChanged();

      router.push("/client/explore");
    } catch (error) {
      console.log({ error });
    }
  };

  const onAccount = () => {
    router.push("/client/account");
  };

  return (
    <header className="w-full border-b border-bloom-border bg-bloom-bg">
      <div className="flex w-full items-center justify-between px-5 py-6 md:px-8 lg:px-12">
        <Link
          href="/client/explore"
          className="font-display text-[26px] tracking-tight"
        >
          Bloombook <span className="text-bloom-accent">❋</span>
        </Link>
        {props.children}
        <div className="flex items-center gap-5">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer">
                  <Avatar>
                    <AvatarImage
                      src={getAssetUrl(user.avatarImg)}
                      alt={user.name}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-[14px] font-semibold sm:inline">
                    {user.name} ▾
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={onAccount}>
                    <BadgeCheckIcon />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleSignout}>
                    <LogOutIcon />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href={"/client/login"}>
              <Button size="lg">Sign in / Sign Up</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
