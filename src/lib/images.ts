const MARK = "/image/upload/";

// Returns a resized, optimised version of a Cloudinary photo.
// Pass a width only to keep the shape, or width and height for a square crop.
export function cldUrl(
  url: string | null | undefined,
  width: number,
  height?: number,
): string | null {
  if (!url) return null;
  if (!url.startsWith("https://res.cloudinary.com/")) return url;
  const i = url.indexOf(MARK);
  if (i === -1) return url;

  const parts = height
    ? ["f_auto", "q_auto", "c_fill", "g_auto", `w_${width}`, `h_${height}`]
    : ["f_auto", "q_auto", "c_limit", `w_${width}`];

  return (
    url.slice(0, i + MARK.length) +
    parts.join(",") +
    "/" +
    url.slice(i + MARK.length)
  );
}