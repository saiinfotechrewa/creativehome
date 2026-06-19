import crypto from "node:crypto";

import {
  getCloudinaryCreds,
  type CloudinaryCreds,
} from "@/lib/integrations";

/**
 * Cloudinary image storage over the signed REST API (no SDK dependency).
 *
 * Uploads are signed server-side: the params are sorted, concatenated and
 * SHA-1'd with the api_secret per Cloudinary's spec. The media library stores
 * the returned `public_id` (as `filename`) so deletes can address the asset.
 */

const API_BASE = "https://api.cloudinary.com/v1_1";

export class CloudinaryNotConfigured extends Error {
  constructor() {
    super("Cloudinary is not configured");
    this.name = "CloudinaryNotConfigured";
  }
}

export interface UploadedAsset {
  publicId: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  mimeType: string;
}

/** SHA-1 signature over the alphabetically-sorted params + api_secret. */
function sign(params: Record<string, string>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");
}

/** Derive a square thumbnail URL from a delivered secure_url. */
function thumbnailFor(secureUrl: string): string {
  // Insert a transformation segment right after `/upload/`.
  return secureUrl.replace(
    "/upload/",
    "/upload/c_fill,w_320,h_320,q_auto,f_auto/",
  );
}

/**
 * Upload an image buffer to Cloudinary.
 *
 * @throws {CloudinaryNotConfigured} when credentials are missing.
 */
export async function uploadImage(params: {
  data: Buffer;
  mimeType: string;
  folder?: string;
}): Promise<UploadedAsset> {
  const creds = await getCloudinaryCreds();
  if (!creds) throw new CloudinaryNotConfigured();

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = params.folder || creds.uploadFolder;

  // Only signed params participate in the signature.
  const signedParams: Record<string, string> = { folder, timestamp };
  const signature = sign(signedParams, creds.apiSecret);

  const dataUri = `data:${params.mimeType};base64,${params.data.toString(
    "base64",
  )}`;

  const form = new FormData();
  form.append("file", dataUri);
  form.append("api_key", creds.apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("signature", signature);

  const res = await fetch(`${API_BASE}/${creds.cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const error =
      (json.error as { message?: string })?.message ??
      `Cloudinary responded ${res.status}`;
    throw new Error(error);
  }

  const secureUrl = String(json.secure_url);
  return {
    publicId: String(json.public_id),
    url: secureUrl,
    thumbnailUrl: thumbnailFor(secureUrl),
    width: Number(json.width ?? 0),
    height: Number(json.height ?? 0),
    bytes: Number(json.bytes ?? params.data.length),
    format: String(json.format ?? ""),
    mimeType: params.mimeType,
  };
}

/** Delete an asset by its public_id. Resolves true when removed (or absent). */
export async function deleteImage(publicId: string): Promise<boolean> {
  const creds = await getCloudinaryCreds();
  if (!creds) throw new CloudinaryNotConfigured();

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = sign({ public_id: publicId, timestamp }, creds.apiSecret);

  const form = new FormData();
  form.append("public_id", publicId);
  form.append("api_key", creds.apiKey);
  form.append("timestamp", timestamp);
  form.append("signature", signature);

  const res = await fetch(`${API_BASE}/${creds.cloudName}/image/destroy`, {
    method: "POST",
    body: form,
  });
  const json = (await res.json().catch(() => ({}))) as { result?: string };
  // "ok" = deleted, "not found" = already gone — both are fine for our purposes.
  return json.result === "ok" || json.result === "not found";
}

/** Lightweight auth check used by the integrations "test connection" action. */
export async function ping(creds: CloudinaryCreds): Promise<boolean> {
  const auth = Buffer.from(`${creds.apiKey}:${creds.apiSecret}`).toString(
    "base64",
  );
  const res = await fetch(`${API_BASE}/${creds.cloudName}/usage`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  return res.ok;
}

export const cloudinaryService = { uploadImage, deleteImage, ping };
