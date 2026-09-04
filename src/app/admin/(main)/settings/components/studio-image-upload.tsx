"use client";

import { ImageIcon, Trash2 } from "lucide-react";
import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";

import { uploadStudioImage } from "@/app/api/admins/admin";
import { Button } from "@/components/ui/button";
import { getAssetUrl } from "@/lib/func";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  // "image/webp",
  // "image/gif",
]);

export function StudioImageUpload({
  value,
  onChange,
  disabled = false,
  disabledReason,
}: {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState("");

  const openPicker = () => {
    if (!disabled && !isUploading) inputRef.current?.click();
  };

  const uploadFile = async (file?: File) => {
    if (!file || disabled || isUploading) return;

    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      setValidationError("Choose a JPG or PNG image.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setValidationError("Image must be 2 MB or smaller.");
      return;
    }

    setValidationError("");
    setIsUploading(true);
    try {
      const response = await uploadStudioImage(file);
      onChange(response.data.url);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void uploadFile(event.dataTransfer.files?.[0]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-xs text-bloom-subtle">Studio image</div>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload studio image"
        aria-disabled={disabled || isUploading}
        onClick={openPicker}
        onKeyDown={handleKeyDown}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled && !isUploading) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`group relative flex min-h-44 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-bloom-accent/20 ${
          isDragging
            ? "border-bloom-accent bg-bloom-soft"
            : "border-bloom-border bg-bloom-soft/50 hover:border-bloom-accent"
        } ${disabled || isUploading ? "cursor-not-allowed opacity-70" : ""}`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getAssetUrl(value)}
            alt="Studio preview"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="px-5 text-center text-sm text-bloom-subtle">
            <ImageIcon className="mx-auto mb-2 size-7" />
            <div className="font-medium text-bloom-text">
              Drop your studio image here
            </div>
            <div className="mt-1 text-xs">or click to browse</div>
          </div>
        )}

        {value && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/35 group-focus-visible:bg-black/35">
            <span className="rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-bloom-text opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              Replace image
            </span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-sm font-medium text-bloom-text">
            Uploading…
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          disabled={disabled || isUploading}
          onChange={(event) => void uploadFile(event.target.files?.[0])}
        />
      </div>

      <div className="flex min-h-8 items-start justify-between gap-3">
        <div>
          <p className="text-xs text-bloom-subtle">
            {disabledReason ?? "JPG or PNG. Maximum 2 MB."}
          </p>
          {validationError && (
            <p role="alert" className="mt-1 text-xs text-red-500">
              {validationError}
            </p>
          )}
        </div>

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled || isUploading}
            onClick={() => onChange("")}
            className="shrink-0 text-bloom-subtle hover:text-red-600"
          >
            <Trash2 />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
