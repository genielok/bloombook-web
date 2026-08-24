"use client";

import { useRef, useState } from "react";
import { ImageIcon, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentField } from "@/components/ui/field";
import { Toast } from "@/components/Toast";
import { updateProfile, uploadFile } from "@/app/api/clients/client";
import { getAssetUrl } from "@/lib/func";
import { User } from "@/app/api/clients/types";
import {
  notifyStoredUserChanged,
  useStoredUser,
} from "@/hooks/use-stored-user";

export default function ProfilePage() {
  const user = useStoredUser();

  return <ProfileForm key={user?.id ?? "guest"} user={user} />;
}

function ProfileForm({ user }: { user?: User }) {
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email] = useState(user?.email ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    user?.avatarImg,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file?: File) => {
    if (!file) return;
    try {
      const { data } = await uploadFile(file);
      setAvatarUrl(data.url);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    try {
      const { data } = await updateProfile({
        name: fullName,
        phone: phone,
        avatarImg: avatarUrl,
      });

      localStorage.setItem("user", JSON.stringify({ ...data }));
      notifyStoredUserChanged();
      setToastVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="px-5 py-8 md:px-8 lg:px-12 lg:py-10">
      <div className="mb-2 text-[13px] uppercase tracking-[0.14em] text-bloom-accent-dark">
        My account
      </div>
      <h1 className="mb-8 font-display text-[38px] font-medium leading-none md:text-[40px]">
        Profile &amp; settings
      </h1>

      <div className="max-w-[560px]">
        <div className="mb-9 flex items-center gap-5">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={`relative flex h-[104px] w-[104px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-dashed bg-bloom-soft text-center transition-colors ${
              isDragging ? "border-bloom-accent" : "border-bloom-border"
            }`}
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getAssetUrl(avatarUrl)}
                alt={fullName || "Profile photo"}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="px-2 text-xs leading-snug text-bloom-subtle">
                <ImageIcon className="mx-auto mb-1 h-4 w-4" />
                Photo
                <div>
                  or{" "}
                  <span className="text-bloom-text underline underline-offset-2">
                    browse files
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-bloom-text text-bloom-bg"
              aria-label="Edit photo"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          <div>
            <div className="text-[15px] font-semibold text-bloom-text">
              Profile photo
            </div>
            <div className="text-sm text-bloom-subtle">
              Drag a photo here, or click to browse.
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <PaymentField
            label="Full name"
            value={fullName}
            onChange={setFullName}
          />
          <PaymentField
            label="Phone number"
            value={phone}
            onChange={setPhone}
            type="tel"
          />

          <div>
            <div className="mb-1.5 text-xs text-bloom-subtle">Email</div>
            <div className="cursor-not-allowed rounded-[10px] border border-bloom-border bg-bloom-soft px-4 py-[15px] text-[15px] text-bloom-subtle">
              {email}
            </div>
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="mt-8 w-fit rounded-full bg-bloom-accent px-9 py-6 text-base font-semibold text-bloom-bg hover:bg-bloom-accent-dark"
        >
          Save changes
        </Button>
      </div>

      <Toast
        visible={toastVisible}
        type="success"
        message="Profile updated"
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}
