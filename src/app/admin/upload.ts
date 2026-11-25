"use server";

import { createHash } from "node:crypto";
import { requireAdmin } from "@/lib/admin-auth";

export type UploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
};

export async function getUploadSignature(): Promise<UploadSignature> {
  await requireAdmin();

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Photo uploads are not set up yet");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "tps/products";
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");

  return { cloudName, apiKey, timestamp, folder, signature };
}