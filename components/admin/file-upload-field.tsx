"use client";

import * as React from "react";
import Image from "next/image";
import { FilePlus2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type UploadResponse = {
  url?: string;
  error?: string;
};

function isImageUrl(value: string) {
  return /\.(png|jpe?g|webp|gif|svg)$/i.test(value);
}

export function FileUploadField({
  name,
  label,
  description,
  value,
  folder,
  accept = "image/*",
  required = false,
  className,
}: {
  name: string;
  label: string;
  description?: string;
  value: string;
  folder: string;
  accept?: string;
  required?: boolean;
  className?: string;
}) {
  const [currentValue, setCurrentValue] = React.useState(value);
  const [isUploading, startUpload] = React.useTransition();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const uploadFile = React.useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as UploadResponse;
      if (!response.ok) {
        throw new Error(payload.error || "Upload failed");
      }

      if (!payload.url) {
        throw new Error("Upload did not return a URL");
      }

      setCurrentValue(payload.url);
    },
    [folder]
  );

  const handleFile = (file: File | null) => {
    if (!file) return;

    startUpload(() => {
      void uploadFile(file).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Upload failed";
        window.alert(message);
      });
    });
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    handleFile(event.dataTransfer.files?.[0] ?? null);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
        <span className="text-xs text-muted-foreground">{accept.includes("image") ? "Image or file upload" : "File upload"}</span>
      </div>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}

      <div
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        className="space-y-3 rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4 transition-colors hover:border-primary/40 hover:bg-muted/30"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            id={name}
            name={name}
            value={currentValue}
            onChange={(event) => setCurrentValue(event.target.value)}
            placeholder="Drop a file, browse, or paste a URL"
            required={required}
            className="flex-1"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <FilePlus2 className="size-4" />
              Browse
            </Button>
            <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              <Upload className="size-4" />
              {isUploading ? "Uploading" : "Drop or Upload"}
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
        />

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-full border border-border/60 px-2 py-1">Folder: {folder}</span>
          {currentValue ? (
            <a href={currentValue} target="_blank" rel="noopener noreferrer" className="truncate text-foreground hover:underline">
              {currentValue}
            </a>
          ) : (
            <span>Drop a file or paste a direct URL.</span>
          )}
        </div>

        {currentValue && isImageUrl(currentValue) ? (
          <div className="relative h-32 overflow-hidden rounded-xl border border-border/60 bg-background/70">
            <Image src={currentValue} alt={label} fill unoptimized className="object-cover" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
