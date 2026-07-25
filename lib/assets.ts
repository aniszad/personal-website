import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Build time asset resolution.
 *
 * Every route is prerendered, so these run during `next build` and never reach
 * the browser. Import them only from server components.
 *
 * The point is that the site never references an image that does not exist. A
 * portrait, a screenshot, or a logo can be dropped into /public and it appears;
 * leave it out and the surrounding layout adapts rather than showing a broken
 * image.
 */

/** True when the given public path resolves to a real file on disk. */
export function publicAssetExists(publicPath: string): boolean {
  const relative = publicPath.replace(/^\/+/, "");
  return existsSync(join(process.cwd(), "public", relative));
}

/**
 * Returns the first candidate that exists, or null when none do.
 *
 * Used so a caller can accept any of several extensions without having to know
 * which one was actually exported from the design tool.
 */
export function resolveAsset(
  candidates: readonly string[],
): string | null {
  return candidates.find(publicAssetExists) ?? null;
}

/** Common raster extensions, in the order we would prefer to serve them. */
const IMAGE_EXTENSIONS = ["webp", "jpg", "jpeg", "png", "avif"] as const;

/**
 * Resolves an image given a path with no extension, trying each supported
 * format. `resolveImage("/images/anis")` finds anis.webp, anis.jpg, and so on.
 */
export function resolveImage(basePath: string): string | null {
  const trimmed = basePath.replace(/\.[a-z0-9]+$/i, "");
  return resolveAsset(
    IMAGE_EXTENSIONS.map((extension) => `${trimmed}.${extension}`),
  );
}

/**
 * Video container formats, best first.
 *
 * WebM is preferred because VP9 or AV1 in it is roughly half the bytes of the
 * equivalent H.264, and MP4 is the guaranteed fallback since every browser
 * plays it. Only one file is served: this picks the better one if it is there.
 */
const VIDEO_EXTENSIONS = ["webm", "mp4"] as const;

/** The video counterpart to resolveImage, for callers that can go without. */
export function resolveVideo(basePath: string): string | null {
  const trimmed = basePath.replace(/\.[a-z0-9]+$/i, "");
  return resolveAsset(
    VIDEO_EXTENSIONS.map((extension) => `${trimmed}.${extension}`),
  );
}
