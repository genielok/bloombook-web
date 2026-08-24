import type { ReactNode } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SettingsSaveButton({
  saved,
  children,
}: {
  saved: boolean;
  children: ReactNode;
}) {
  return (
    <Button
      type="submit"
      className="min-w-[120px] bg-bloom-text text-[13px] font-semibold text-bloom-bg hover:bg-bloom-text/90"
    >
      {saved ? (
        <>
          <Check /> Saved
        </>
      ) : (
        children
      )}
    </Button>
  );
}
