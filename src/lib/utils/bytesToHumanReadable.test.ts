import { describe, expect, it } from "vitest";
import { bytesToHumanReadable } from "./bytesToHumanReadable";

describe("bytesToHumanReadable", () => {
  it("formats 0 bytes", () => {
    expect(bytesToHumanReadable(0)).toBe("0 Bytes");
  });

  it("returns 0 Bytes for invalid inputs", () => {
    expect(bytesToHumanReadable(-1)).toBe("0 Bytes");
    expect(bytesToHumanReadable(Number.NaN)).toBe("0 Bytes");
    expect(bytesToHumanReadable(Number.POSITIVE_INFINITY)).toBe("0 Bytes");
    expect(bytesToHumanReadable(Number.NEGATIVE_INFINITY)).toBe("0 Bytes");
  });

  it("formats bytes < 1 KiB as Bytes", () => {
    expect(bytesToHumanReadable(1)).toBe("1 Bytes");
    expect(bytesToHumanReadable(999)).toBe("999 Bytes");
    expect(bytesToHumanReadable(1023)).toBe("1023 Bytes");
  });

  it("formats powers of 1024 with IEC units", () => {
    expect(bytesToHumanReadable(1024)).toBe("1 KiB");
    expect(bytesToHumanReadable(1024 ** 2)).toBe("1 MiB");
    expect(bytesToHumanReadable(1024 ** 3)).toBe("1 GiB");
    expect(bytesToHumanReadable(1024 ** 4)).toBe("1 TiB");
    expect(bytesToHumanReadable(1024 ** 5)).toBe("1 PiB");
  });

  it("rounds to one decimal place and trims trailing .0", () => {
    expect(bytesToHumanReadable(1536)).toBe("1.5 KiB");
    expect(bytesToHumanReadable(10 * 1024)).toBe("10 KiB");
  });

  it("caps to the largest supported unit for extremely large values", () => {
    const result = bytesToHumanReadable(Number.MAX_VALUE);
    expect(result.endsWith(" YiB")).toBe(true);
  });
});
