"use client";

import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentField } from "@/components/ui/field";
import { adminSignIn, createAdminAccount } from "@/app/api/admins/admin";
import {
  getApiFieldErrors,
  getErrorMessage,
  SignupFormSchema,
} from "@/lib/func";

type AdminAuthMode = "login" | "register";

export function AdminAuthPage({ mode }: { mode: AdminAuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegister = mode === "register";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullNameError, setFullNameError] = useState<string>();
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearErrors = () => {
    setFullNameError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);
    setFormError(undefined);
  };

  const applyApiError = (error: unknown) => {
    const fieldErrors = getApiFieldErrors(error);
    setFullNameError(fieldErrors.name ?? fieldErrors.fullName);
    setEmailError(fieldErrors.email);
    setPasswordError(fieldErrors.password);

    if (
      !fieldErrors.name &&
      !fieldErrors.fullName &&
      !fieldErrors.email &&
      !fieldErrors.password
    ) {
      setFormError(getErrorMessage(error));
    }
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();

    if (isRegister) {
      await signup();
      return;
    }

    setIsSubmitting(true);
    try {
      await adminSignIn({ email: email.trim(), password });

      const callbackUrl = searchParams.get("callbackUrl");
      router.push(callbackUrl?.startsWith("/admin/") ? callbackUrl : "/admin");
      router.refresh();
    } catch (error: unknown) {
      applyApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  async function signup() {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    const validatedFields = SignupFormSchema.safeParse({
      name: fullName,
      email: email,
      password: password,
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      setFullNameError(fieldErrors.name?.[0]);
      setEmailError(fieldErrors.email?.[0]);
      setPasswordError(fieldErrors.password?.[0]);
      return;
    }

    setIsSubmitting(true);
    try {
      await createAdminAccount({
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        password: validatedFields.data.password,
      });
      router.push("/admin/login");
      router.refresh();
    } catch (error: unknown) {
      applyApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-svh items-start justify-center bg-[#f7f2ec] px-4 py-4 text-bloom-text sm:px-6 sm:py-[50px]">
      <section className="w-full max-w-[570px] rounded-[20px] border border-bloom-border bg-white px-6 py-10 shadow-[0_1px_3px_rgba(34,30,26,0.04)] sm:px-[51px] sm:py-[58px]">
        <div className="text-center">
          <Link href="/" className="font-display text-[42px] leading-none">
            Bloombook
          </Link>
          <div className="mt-6">
            <Badge className="h-7 rounded-lg border-0 bg-[#f4ebe2] px-3 text-xs font-bold tracking-[0.04em] text-bloom-accent-dark uppercase">
              Admin
            </Badge>
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-[24px] font-semibold tracking-[-0.02em]">
            {isRegister ? "Create an account" : "Sign in"}
          </h1>
          <p className="mt-1.5 text-[16px] leading-relaxed text-bloom-subtle">
            {isRegister
              ? "Start managing your studio on Bloombook."
              : "Manage your studio's bookings, staff and services."}
          </p>
        </div>

        <form onSubmit={submit} className="mt-4 flex flex-col gap-5">
          {isRegister && (
            <>
              <PaymentField
                label="Full name"
                name="fullName"
                value={fullName}
                onChange={(value) => {
                  setFullName(value);
                  setFullNameError(undefined);
                  setFormError(undefined);
                }}
                placeholder="Mara Voss"
                autoComplete="name"
                required
                error={fullNameError}
              />
            </>
          )}

          <PaymentField
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              setEmailError(undefined);
              setFormError(undefined);
            }}
            placeholder="you@studio.com"
            autoComplete="email"
            required
            error={emailError}
          />
          <PaymentField
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setPasswordError(undefined);
              setFormError(undefined);
            }}
            placeholder="••••••••"
            autoComplete={isRegister ? "new-password" : "current-password"}
            required
            error={passwordError}
          />

          {isRegister && (
            <PaymentField
              label="Confirm password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value);
                setPasswordError(undefined);
              }}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          )}

          {formError && (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-[60px] rounded-xl bg-bloom-text text-[18px] font-semibold text-bloom-bg hover:bg-bloom-text/90"
          >
            {isSubmitting
              ? isRegister
                ? "Creating account…"
                : "Signing in…"
              : isRegister
                ? "Create account"
                : "Sign in"}
          </Button>
        </form>

        <p className="mt-8 text-center text-[15px] text-bloom-subtle">
          {isRegister ? "Already have an account? " : "New to Bloombook? "}
          <Link
            href={isRegister ? "/admin/login" : "/admin/register"}
            className="font-semibold text-bloom-accent-dark hover:underline"
          >
            {isRegister ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </section>
    </main>
  );
}
