"use client";

import { createAccount } from "@/app/api/explore";
import { Button } from "@/components/ui/button";
import { PaymentField } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type CreateAccountErrors = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  form: string;
}>;

export const CreateAccountComponent = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("Sofia");
  const [lastName, setLastName] = useState("Lindqvist");
  const [email, setEmail] = useState("sofia.l@email.com");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<CreateAccountErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateForm() {
    const nextErrors: CreateAccountErrors = {};
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFirstName) {
      nextErrors.firstName = "First name is required.";
    }

    if (!trimmedLastName) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    return nextErrors;
  }

  function clearError(field: keyof CreateAccountErrors) {
    setErrors((currentErrors) => {
      if (!currentErrors[field] && !currentErrors.form) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      delete nextErrors.form;
      return nextErrors;
    });
  }

  function getSubmitErrorMessage(error: unknown) {
    if (!(error instanceof Error)) {
      return "Could not create account. Please try again.";
    }

    try {
      const parsed = JSON.parse(error.message) as { message?: string };
      return parsed.message ?? error.message;
    } catch {
      return error.message;
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createAccount({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });

      if (!response.ok) {
        throw new Error(response.message);
      }

      router.push("/client/login");
      router.refresh();
    } catch (error) {
      setErrors({
        form: getSubmitErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-bloom-border" />
        <span className="text-xs text-bloom-subtle">or create with email</span>
        <div className="h-px flex-1 bg-bloom-border" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <PaymentField
          label="First name"
          name="firstName"
          value={firstName}
          onChange={(value) => {
            setFirstName(value);
            clearError("firstName");
          }}
          placeholder="Sofia"
          autoComplete="given-name"
          required
          error={errors.firstName}
        />

        <PaymentField
          label="Last name"
          name="lastName"
          value={lastName}
          onChange={(value) => {
            setLastName(value);
            clearError("lastName");
          }}
          placeholder="Lindqvist"
          autoComplete="family-name"
          required
          error={errors.lastName}
        />
      </div>

      <PaymentField
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={(value) => {
          setEmail(value);
          clearError("email");
        }}
        placeholder="sofia.l@email.com"
        autoComplete="email"
        required
        error={errors.email}
      />

      <PaymentField
        label="Password"
        type="password"
        name="password"
        value={password}
        onChange={(value) => {
          setPassword(value);
          clearError("password");
        }}
        placeholder="••••••••"
        autoComplete="new-password"
        required
        error={errors.password}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 px-4 py-6 text-[16px] hover:opacity-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-bloom-accent/25"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
      {errors.form && (
        <p className="text-sm text-destructive" role="alert">
          {errors.form}
        </p>
      )}
    </form>
  );
};
