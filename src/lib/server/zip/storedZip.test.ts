import { setTimeout } from "node:timers/promises";
import { describe, expect, it, vi } from "vitest";
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

describe("storedZip", () => {
  it("writes a stored archive whose length matches the bytes", async () => {
    const { body, length } = storedZip([
      entry("a.deb", 5, [bytesOf("hel"), bytesOf("lo")]),
      entry("pākete.deb", 0),
    ]);
    const { bytes, entries } = await archiveOf(body);

    expect(bytes.byteLength).toBe(length);
    expect(entries).toEqual([
      { name: "a.deb", compressionMethod: 0, data: bytesOf("hello") },
      { name: "pākete.deb", compressionMethod: 0, data: new Uint8Array() },
    ]);
  });

  it("opens the next entry only after the previous one is drained", async () => {
    const openFirst = vi.fn(async () => streamOf([bytesOf("a")]));
    const openSecond = vi.fn(async () => streamOf([bytesOf("b")]));

    const { body } = storedZip([
      { name: "a.deb", size: 1, open: openFirst },
      { name: "b.deb", size: 1, open: openSecond },
    ]);

    expect(openFirst).toHaveBeenCalledTimes(1);
    expect(openSecond).not.toHaveBeenCalled();
    await archiveOf(body);
    expect(openFirst).toHaveBeenCalledTimes(1);
    expect(openSecond).toHaveBeenCalledTimes(1);
  });

  it("errors the archive when an entry cannot be opened", async () => {
    const failure = new Error("librarian is down");

    const { body } = storedZip([
      { name: "a.deb", size: 1, open: async () => Promise.reject(failure) },
    ]);

    await expect(new Response(body).arrayBuffer()).rejects.toThrow(failure);
  });

  it("errors the archive when an entry yields fewer bytes than declared", async () => {
    const { body } = storedZip([entry("a.deb", 3, [bytesOf("ab")])]);

    await expect(new Response(body).arrayBuffer()).rejects.toThrow();
  });

  it("cancelling the archive cancels the open entry and opens nothing else", async () => {
    const cancel = vi.fn();
    const endless = new ReadableStream<Uint8Array>({
      pull(controller) {
        controller.enqueue(new Uint8Array(1024));
      },
      cancel,
    });
    const openSecond = vi.fn(async () => streamOf([bytesOf("x")]));

    const reader = storedZip([
      { name: "endless.deb", size: 1_000_000_000, open: async () => endless },
      { name: "second.deb", size: 1, open: openSecond },
    ]).body.getReader();
    for (let index = 0; index < 3; index++) {
      await reader.read();
    }
    await reader.cancel();
    await vi.waitFor(() => expect(cancel).toHaveBeenCalledTimes(1));

    expect(openSecond).not.toHaveBeenCalled();
  });

  it("cancelling before reading opens no further entries", async () => {
    const openSecond = vi.fn(async () => streamOf([bytesOf("b")]));

    await storedZip([
      entry("a.deb", 1_048_576, [new Uint8Array(1_048_576)]),
      { name: "b.deb", size: 1, open: openSecond },
    ]).body.cancel();
    await setTimeout(10);

    expect(openSecond).not.toHaveBeenCalled();
  });

  it("writes a valid empty archive", async () => {
    const { body, length } = storedZip([]);
    const { bytes, entries } = await archiveOf(body);

    expect(length).toBe(22);
    expect(bytes.byteLength).toBe(22);
    expect(entries).toEqual([]);
  });
});
