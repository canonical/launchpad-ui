import { afterEach, describe, expect, it, vi } from "vitest";
import { storedZip } from "./storedZip.js";
import { archiveOf } from "./test.zipReader.js";
import type { StoredZipEntry } from "./types.js";

const encoder = new TextEncoder();

function bytesOf(text: string): Uint8Array {
  return encoder.encode(text);
}

function streamOf(chunks: Uint8Array[]): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });
}

function entry(
  name: string,
  size: number,
  chunks: Uint8Array[] = [],
): StoredZipEntry {
  return { name, size, open: async () => streamOf(chunks) };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("storedZip", () => {
  it("writes a stored archive whose length matches the bytes", async () => {
    const entries = [
      entry("a.deb", 5, [bytesOf("hel"), bytesOf("lo")]),
      entry("empty.deb", 0),
    ];

    const { body, length } = storedZip(entries);
    const { bytes, archive } = await archiveOf(body);

    expect(bytes.byteLength).toBe(length);
    expect(archive.zip64).toBe(false);
    expect(archive.entries.map((record) => record.name)).toEqual([
      "a.deb",
      "empty.deb",
    ]);
    expect(archive.entries[0].data).toEqual(bytesOf("hello"));
    expect(archive.entries[1].data.byteLength).toBe(0);
    expect(
      archive.entries.map((record) => [
        record.flags,
        record.versionNeeded,
        record.zip64,
      ]),
    ).toEqual([
      [0x0808, 20, false],
      [0x0808, 20, false],
    ]);
  });

  it("passes entry chunks through without re-buffering", async () => {
    const first = bytesOf("hel");
    const second = bytesOf("lo");

    const reader = storedZip([
      entry("a.deb", 5, [first, second]),
    ]).body.getReader();
    await reader.read();

    expect((await reader.read()).value).toBe(first);
    expect((await reader.read()).value).toBe(second);
  });

  it("encodes UTF-8 names with the UTF-8 flag", async () => {
    const { archive } = await archiveOf(
      storedZip([entry("pākete.deb", 1, [bytesOf("x")])]).body,
    );
    const [record] = archive.entries;

    expect(record.name).toBe("pākete.deb");
    expect(record.flags & 0x0800).toBe(0x0800);
  });

  it("uses the zip64 layout when forced", async () => {
    const entries = [
      entry("a.deb", 5, [bytesOf("hello")]),
      entry("b.deb", 1, [bytesOf("!")]),
    ];

    const { body, length } = storedZip(entries, { zip64: true });
    const { bytes, archive } = await archiveOf(body);

    expect(bytes.byteLength).toBe(length);
    expect(length - storedZip(entries).length).toBe(entries.length * 56 + 76);
    expect(archive.zip64).toBe(true);
    expect(archive.entries.map((record) => record.zip64)).toEqual([true, true]);
    expect(archive.entries.map((record) => record.versionNeeded)).toEqual([
      45, 45,
    ]);
    expect(archive.entries[1].data).toEqual(bytesOf("!"));
  });

  it("chooses the zip64 layout automatically when a limit is exceeded", () => {
    const hugeEntry = [entry("big.deb", 0xffffffff)];
    const hugeTotal = [entry("a.deb", 0x80000000), entry("b.deb", 0x80000000)];
    const manyEntries = Array.from({ length: 0xffff }, (_, index) =>
      entry(`f${index}`, 0),
    );
    const small = [entry("small.deb", 1)];

    expect(storedZip(hugeEntry).length).toBe(
      storedZip(hugeEntry, { zip64: true }).length,
    );
    expect(storedZip(hugeTotal).length).toBe(
      storedZip(hugeTotal, { zip64: true }).length,
    );
    expect(storedZip(manyEntries).length).toBe(
      storedZip(manyEntries, { zip64: true }).length,
    );
    expect(storedZip(small).length).toBe(
      storedZip(small, { zip64: false }).length,
    );
  });

  it("rejects an entry that yields fewer bytes than declared", async () => {
    await expect(
      archiveOf(storedZip([entry("a.deb", 3, [bytesOf("ab")])]).body),
    ).rejects.toThrow(/produced 2 bytes instead of 3/);
  });

  it("rejects an entry that yields more bytes than declared and cancels it", async () => {
    const cancel = vi.fn();
    const source = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(bytesOf("abc"));
        controller.enqueue(bytesOf("d"));
      },
      cancel,
    });
    const oversized: StoredZipEntry = {
      name: "a.deb",
      size: 2,
      open: async () => source,
    };

    await expect(archiveOf(storedZip([oversized]).body)).rejects.toThrow(
      /exceeds its declared size/,
    );
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it("cancelling the archive cancels the open entry and opens nothing else", async () => {
    const cancel = vi.fn();
    const endless = new ReadableStream<Uint8Array>({
      pull(controller) {
        controller.enqueue(new Uint8Array([1]));
      },
      cancel,
    });
    const openSecond = vi.fn(async () => streamOf([bytesOf("x")]));
    const entries: StoredZipEntry[] = [
      { name: "endless.deb", size: 1_000_000, open: async () => endless },
      { name: "second.deb", size: 1, open: openSecond },
    ];

    const reader = storedZip(entries).body.getReader();
    for (let index = 0; index < 3; index++) {
      await reader.read();
    }
    await reader.cancel();

    expect(cancel).toHaveBeenCalledTimes(1);
    expect(openSecond).not.toHaveBeenCalled();
  });

  it("writes a valid empty archive", async () => {
    const { body, length } = storedZip([]);
    const { bytes, archive } = await archiveOf(body);

    expect(length).toBe(22);
    expect(bytes.byteLength).toBe(22);
    expect(archive.entries).toEqual([]);
  });

  it("stamps entries with the current time as a DOS date and time", async () => {
    vi.setSystemTime(new Date(Date.UTC(2026, 9, 23, 14, 36, 7)));

    const { archive } = await archiveOf(
      storedZip([entry("a.deb", 1, [bytesOf("a")])]).body,
    );
    const [record] = archive.entries;

    expect(record.dosDate).toBe(0x5d57);
    expect(record.dosTime).toBe(0x7483);
  });
});
