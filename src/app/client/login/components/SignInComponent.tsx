"use client";

import { signIn } from "@/app/api/clients/client";
import { Button } from "@/components/ui/button";
import { PaymentField } from "@/components/ui/field";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export const SignInComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const { data } = await signIn({
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(data.user));

      const callbackUrl = searchParams.get("callbackUrl");
      router.push(
        callbackUrl?.startsWith("/client/")
          ? callbackUrl
          : "/client/account",
      );
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3">
      <PaymentField
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={setEmail}
        placeholder="xxx@email.com"
        autoComplete="email"
        required
      />

      <div className="grid gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-bloom-subtle">Password</span>
          <Link
            href="#"
            className="text-xs font-semibold text-bloom-accent-dark"
          >
            Forgot password?
          </Link>
        </div>
        <PaymentField
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          className="[&_[data-slot=field-label]]:sr-only"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className=" px-4 py-6 text-[16px]   hover:opacity-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-bloom-accent/25"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};
