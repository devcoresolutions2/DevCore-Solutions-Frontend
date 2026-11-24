import type {
  BroadcastAccountItem,
  BroadcastPlatformKey,
  SocialMediaAssetItem,
} from "@/lib/api";

export function countPlatformCharsClient(platform: BroadcastPlatformKey, text: string): number {
  if (!text) return 0;
  if (platform === "TWITTER_X") {
    const urlRegex = /https?:\/\/[^\s]+/gi;
    let urlCount = 0;
    const remaining = text.replace(urlRegex, () => {
      urlCount += 1;
      return "";
    });
    let weight = urlCount * 23;
    for (const ch of remaining) {
      const cp = ch.codePointAt(0) ?? 0;
      weight += cp > 0x10ff ? 2 : 1;
    }
    return weight;
  }
  return Array.from(text).length;
}

export function resolveVariablesPreview(
  text: string,
  variables: Record<string, string>,
): { resolved: string; unresolved: string[] } {
  const unresolvedSet = new Set<string>();
  const resolved = text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key: string) => {
    const val = variables[key]?.trim();
    if (val) return val;
    unresolvedSet.add(key);
    return match;
  });
  return { resolved, unresolved: Array.from(unresolvedSet) };
}

export function validateAccountDraft(
  account: BroadcastAccountItem,
  rawText: string,
  variables: Record<string, string>,
  media: SocialMediaAssetItem[],
): { valid: boolean; charCount: number; maxChars: number; errors: string[]; resolvedText: string } {
  const { resolved, unresolved } = resolveVariablesPreview(rawText, variables);
  const errors: string[] = [];
  const charCount = countPlatformCharsClient(account.platform, resolved);
  const maxChars = account.rules.maxChars;

  if (!account.canPublish) {
    errors.push(account.publishBlockReason || "Account cannot publish.");
  }
  if (unresolved.length > 0) {
    errors.push(`Unresolved variables: ${unresolved.map((v) => `{{${v}}}`).join(", ")}`);
  }
  if (!resolved.trim() && media.length === 0) {
    errors.push("Content or media attachment required.");
  }
  if (charCount > maxChars) {
    errors.push(`Exceeds ${maxChars} char limit (${charCount}/${maxChars}).`);
  }

  const images = media.filter((m) => m.resourceType === "image" && m.format !== "gif");
  const gifs = media.filter((m) => m.format === "gif");
  const videos = media.filter((m) => m.resourceType === "video");

  if (images.length > account.rules.maxImages) {
    errors.push(`Max ${account.rules.maxImages} images allowed.`);
  }
  if (videos.length > account.rules.maxVideos) {
    errors.push(`Max ${account.rules.maxVideos} video allowed.`);
  }
  if (
    account.platform === "TWITTER_X" &&
    gifs.length > 0 &&
    (images.length > 0 || videos.length > 0 || gifs.length > 1)
  ) {
    errors.push("X allows 1 GIF, 1 video, or up to 4 images.");
  }

  for (const m of media) {
    if (m.format === "gif" && m.bytes > account.rules.maxGifBytes) {
      errors.push(`${m.fileName} exceeds GIF size limit.`);
    } else if (m.resourceType === "image" && m.format !== "gif" && m.bytes > account.rules.maxImageBytes) {
      errors.push(`${m.fileName} exceeds image size limit.`);
    } else if (m.resourceType === "video" && m.bytes > account.rules.maxVideoBytes) {
      errors.push(`${m.fileName} exceeds video size limit.`);
    }
  }

  return {
    valid: errors.length === 0,
    charCount,
    maxChars,
    errors,
    resolvedText: resolved,
  };
}
