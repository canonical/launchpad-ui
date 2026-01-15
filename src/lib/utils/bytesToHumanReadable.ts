/**
 * Converts a number of bytes into a human-readable string with appropriate units.
 * @param bytes The number of bytes.
 * @returns A human-readable string representation of the byte size.
 */
export function bytesToHumanReadable(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 Bytes";
  const k = 1024;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];
  const i = Math.min(
    sizes.length - 1,
    Math.floor(Math.log(bytes) / Math.log(k)),
  );
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${value} ${sizes[i]}`;
}
