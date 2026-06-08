export function getFingerprint(): string {
  if (typeof window === "undefined") return "server";

  const stored = sessionStorage.getItem("toalesco_fp");
  if (stored) return stored;

  const nav = window.navigator;
  const screen = window.screen;
  const raw = [
    nav.userAgent,
    nav.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    nav.hardwareConcurrency,
    nav.platform,
  ].join("|||");

  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  const fp = `fp_${Math.abs(hash).toString(36)}`;
  sessionStorage.setItem("toalesco_fp", fp);
  return fp;
}
