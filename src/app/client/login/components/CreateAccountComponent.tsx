"use client";

import { createAccount } from "@/app/api/clients/client";
import { Button } from "@/components/ui/button";
import { PaymentField } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { getApiFieldErrors, getErrorMessage } from "@/lib/func";

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
  const [email, setEmail] = useState("sofia.l@email.com");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<CreateAccountErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validateForm() {
    const nextErrors: CreateAccountErrors = {};
    const trimmedFirstName = firstName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFirstName) {
      nextErrors.firstName = "Name is required.";
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await createAccount({
        name: firstName.trim(),
        email: email.trim(),
        password,
      });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/client/explore");
      router.refresh();
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error);
      const hasFieldErrors = Object.keys(fieldErrors).length > 0;
      setErrors({
        firstName: fieldErrors.name ?? fieldErrors.firstName,
        email: fieldErrors.email,
        password: fieldErrors.password,
        form: hasFieldErrors ? undefined : getErrorMessage(error),
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

      <PaymentField
        label="Name"
        name="firstName"
        value={firstName}
        onChange={(value) => {
          setFirstName(value);
          clearError("firstName");
        }}
        placeholder="name"
        autoComplete="given-name"
        required
        error={errors.firstName}
      />

      <PaymentField
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={(value) => {
          setEmail(value);
          clearError("email");
        }}
        placeholder="xxx@email.com"
        autoComplete="email"
        required
        error={errors.email}
      />

      <PaymentField
        label="Password"
        type={showPassword ? "text" : "password"}
        name="password"
        value={password}
        onChange={(value) => {
          setPassword(value);
          clearError("password");
        }}
        placeholder="•••"
        autoComplete="new-password"
        required
        error={errors.password}
        suffix={
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-bloom-subtle transition-colors hover:text-bloom-text"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        }
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
