"use client";

import { useRef, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import { updateUserImage } from "./actions";
import { useSession } from "@/lib/auth-client";
import { CropModal } from "./_crop-modal";
import { useUploadThing } from "@/lib/uploadthing";

export function AvatarUpload({
  currentImage,
  name,
}: {
  currentImage: string | null | undefined;
  name: string | null | undefined;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { refetch } = useSession();
  const { startUpload } = useUploadThing("profileImage");

  function handleFileSelect(file: File) {
    const objectUrl = URL.createObjectURL(file);
    setCropSrc(objectUrl);
  }

  function handleCropConfirm(blob: Blob) {
    if (!cropSrc) return;
    URL.revokeObjectURL(cropSrc);
    setCropSrc(null);

    const previewUrl = URL.createObjectURL(blob);
    setPreview(previewUrl);

    startTransition(async () => {
      try {
        const file = new File([blob], "avatar.webp", { type: "image/webp" });
        const uploaded = await startUpload([file]);
        if (!uploaded?.[0]) throw new Error("Upload failed");
        const url = uploaded[0].ufsUrl;
        await updateUserImage(url);
        await refetch();
        URL.revokeObjectURL(previewUrl);
        setPreview(url);
        toast.success("Profile picture updated");
      } catch {
        toast.error("Failed to update profile picture");
        URL.revokeObjectURL(previewUrl);
        setPreview(null);
      }
    });
  }

  function handleCropCancel() {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  }

  const displayImage = preview ?? currentImage ?? null;
  const initials = name?.charAt(0) ?? "?";

  return (
    <>
      {cropSrc && (
        <CropModal
          imageSrc={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

      <div className="flex items-center gap-4">
        <div className="relative group">
          <Avatar className="size-16">
            {displayImage && (
              <AvatarImage
                src={displayImage}
                alt={name ?? ""}
                className="rounded-full object-cover"
              />
            )}
            <AvatarFallback className="rounded-full text-lg">{initials}</AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isPending ? (
              <Loader2 className="size-4 text-white animate-spin" />
            ) : (
              <Camera className="size-4 text-white" />
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
              e.target.value = "";
            }}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-700">{name}</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors mt-0.5"
          >
            {isPending ? "Uploading…" : "Change photo"}
          </button>
        </div>
      </div>
    </>
  );
}
