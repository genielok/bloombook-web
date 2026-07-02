"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
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
import type { User } from "@/types/user";

export const HeaderClient = (props: {
  user?: User;
  children?: React.ReactNode;
}) => {
  const { user } = props;
  const router = useRouter();

  const handleSignout = async () => {
    try {
      await fetch("/api/auth-mock/logout", {
        method: "POST",
      });
      router.push("/client/explore");
      router.refresh();
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
                      src={user.avatarUrl}
                      alt={user.name}
                      className="grayscale"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-[14px] font-semibold sm:inline"></span>
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
};
