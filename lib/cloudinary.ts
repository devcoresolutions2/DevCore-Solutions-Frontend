import type { AvatarSignatureResponse } from "./api";

export const MAX_AVATAR_BYTES = 25 * 1024 * 1024; // 25 MB
export const ALLOWED_AVATAR_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Generates an optimized Cloudinary delivery URL for a given square avatar size.
 * Applies f_auto, q_auto, c_fill, g_face, and exact w/h dimensions.
 */
export function getOptimizedAvatarUrl(
  url: string | null | undefined,
  size: 64 | 96 | 256 | 512 = 256
): string | null {
  if (!url) return null;

  // If it's a Cloudinary upload URL, inject/replace the transformation segment
  const uploadMarker = "/image/upload/";
  const idx = url.indexOf(uploadMarker);
  if (idx !== -1) {
    const prefix = url.slice(0, idx + uploadMarker.length);
    let rest = url.slice(idx + uploadMarker.length);

    // Strip any existing transformation segments before the version (v12345/) or folder
    const versionMatch = rest.match(/(?:^|\/)(v\d+\/.*)$/);
    if (versionMatch) {
      rest = versionMatch[1];
    } else if (rest.includes("/") && !rest.startsWith("devcore/")) {
      // If first segment looks like a transformation (contains commas or underscores like c_fill,w_512)
      const firstSlash = rest.indexOf("/");
      const firstSeg = rest.slice(0, firstSlash);
      if (firstSeg.includes(",") || /^(w_|h_|c_|f_|q_|g_)/.test(firstSeg)) {
        rest = rest.slice(firstSlash + 1);
      }
    }

    const transform = `c_fill,g_face,w_${size},h_${size},f_auto,q_auto`;
    return `${prefix}${transform}/${rest}`;
  }

  return url;
}

/**
 * Validates file size (<= 25MB), MIME type, magic bytes signature, and image decoding.
 */
export async function validateAvatarFile(
  file: File
): Promise<{ valid: true; width: number; height: number } | { valid: false; error: string }> {
  if (!file || file.size === 0) {
    return { valid: false, error: "Selected file is empty." };
  }

  if (file.size > MAX_AVATAR_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Image is ${mb} MB, which exceeds the 25 MB maximum upload limit.`,
    };
  }

  if (!ALLOWED_AVATAR_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Unsupported file type. Please choose a JPEG, PNG, or WebP image.",
    };
  }

  // Magic-byte verification
  try {
    const headerBuffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(headerBuffer);

    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isPng =
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a;
    const isWebp =
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50;

    if (!isJpeg && !isPng && !isWebp) {
      return {
        valid: false,
        error: "Invalid image file signature. The file appears corrupted or spoofed.",
      };
    }
  } catch {
    return { valid: false, error: "Could not read file header for validation." };
  }

  // Verify browser image decoding & dimensions
  return await new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (img.naturalWidth < 32 || img.naturalHeight < 32) {
        resolve({
          valid: false,
          error: "Image dimensions are too small. Minimum size is 32×32 pixels.",
        });
      } else {
        resolve({ valid: true, width: img.naturalWidth, height: img.naturalHeight });
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        valid: false,
        error: "Unable to decode image. Please choose a valid JPEG, PNG, or WebP file.",
      });
    };
    img.src = objectUrl;
  });
}

/**
 * Uploads directly to Cloudinary with signed authorization, progress tracking, and abort support.
 */
export function uploadAvatarToCloudinary(
  file: File,
  sig: AvatarSignatureResponse,
  onProgress?: (percent: number) => void,
  signal?: AbortSignal
): Promise<{ publicId: string; secureUrl: string; version: number; bytes: number }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const endpoint = `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`;

    if (signal) {
      if (signal.aborted) {
        reject(new Error("Upload cancelled."));
        return;
      }
      signal.addEventListener("abort", () => {
        xhr.abort();
        reject(new Error("Upload cancelled."));
      });
    }

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        const pct = Math.min(99, Math.round((e.loaded / e.total) * 100));
        onProgress(pct);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (onProgress) onProgress(100);
          resolve({
            publicId: data.public_id,
            secureUrl: data.secure_url,
            version: data.version,
            bytes: data.bytes,
          });
        } catch {
          reject(new Error("Invalid response received from Cloudinary."));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          reject(new Error(errData?.error?.message || `Cloudinary upload failed (${xhr.status}).`));
        } catch {
          reject(new Error(`Cloudinary upload failed with status ${xhr.status}.`));
        }
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error while uploading image to Cloudinary."));
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", sig.apiKey);
    formData.append("timestamp", String(sig.timestamp));
    formData.append("signature", sig.signature);
    formData.append("folder", sig.folder);
    formData.append("public_id", sig.publicId);
    formData.append("eager", sig.eager);
    formData.append("allowed_formats", sig.allowedFormats);

    xhr.open("POST", endpoint);
    xhr.send(formData);
  });
}
