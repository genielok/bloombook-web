import type { ComponentProps, ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function AdminTab({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  return (
    <TabsTrigger
      value={value}
      className="h-auto flex-none rounded-none px-0.5 pb-3 text-sm data-active:text-bloom-text after:bg-bloom-text"
    >
      {children}
    </TabsTrigger>
  );
}

export function AdminFormField({
  label,
  htmlFor,
  required = false,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-normal text-bloom-subtle">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-[#b0453a]">
            *
          </span>
        )}
      </Label>
      {children}
    </div>
  );
}

type AdminInputProps = ComponentProps<typeof Input> & {
  compact?: boolean;
};

export function AdminInput({
  compact = false,
  className,
  ...props
}: AdminInputProps) {
  return (
    <Input
      {...props}
      className={cn(
        "rounded-lg border-bloom-border bg-white shadow-none focus-visible:border-bloom-accent focus-visible:ring-bloom-accent/20",
        compact ? "h-9 text-[13px]" : "h-10 text-sm",
        className,
      )}
    />
  );
}
