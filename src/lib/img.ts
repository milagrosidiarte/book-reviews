export function toHttps(url: string | undefined | null): string {
  if (!url) return "";
  return url.replace(/^http:\/\//, "https://");
}
