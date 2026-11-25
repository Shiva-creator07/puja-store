"use client";

import { useState } from "react";
import { getUploadSignature } from "@/app/admin/upload";
import { cldUrl } from "@/lib/images";

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUploader({
  initialUrl,
}: {
  initialUrl: string | null;
}) {
  const [url, setUrl] = useState<string>(initialUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    setError(null);

    if (!TYPES.includes(file.type)) {
      setError("Please choose a JPG, PNG or WebP photo.");
      input.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That photo is over 5 MB. Please choose a smaller one.");
      input.value = "";
      return;
    }

    setBusy(true);
    try {
      const sig = await getUploadSignature();
      const body = new FormData();
      body.append("file", file);
      body.append("api_key", sig.apiKey);
      body.append("timestamp", String(sig.timestamp));
      body.append("folder", sig.folder);
      body.append("signature", sig.signature);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        { method: "POST", body },
      );
      const data = (await res.json()) as {
        secure_url?: string;
        error?: { message?: string };
      };
      if (!res.ok || !data.secure_url) {
        throw new Error(data.error?.message ?? "Upload failed");
      }
      setUrl(data.secure_url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Upload failed. Please try again.",
      );
    } finally {
      setBusy(false);
      input.value = "";
    }
  }

  const preview = cldUrl(url, 400, 400);

  return (
    <div>
      <p className="text-sm font-medium text-stone-700">Product photo</p>
      <input type="hidden" name="imageUrl" value={url} />

      <div className="mt-2 flex flex-wrap items-center gap-4">
        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-amber-300 bg-amber-100 text-4xl">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Product preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <span aria-hidden="true">🪔</span>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <label className="inline-block cursor-pointer rounded-lg bg-orange-700 px-4 py-2 font-semibold text-white hover:bg-orange-800">
              {busy ? "Uploading..." : url ? "Change photo" : "Choose photo"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onFile}
                disabled={busy}
                className="hidden"
              />
            </label>
            {url && !busy && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-stone-500">
            JPG, PNG or WebP, up to 5 MB. Square photos look best.
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}