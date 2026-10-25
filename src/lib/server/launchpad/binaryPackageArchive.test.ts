import { beforeEach, describe, expect, it, vi } from "vitest";
import { binaryDetails } from "$lib/modules/packages/test.fixtures.js";
import type { BinaryPackageDetails } from "$lib/server/launchpad/types.js";
import { archiveOf } from "$lib/server/zip/test.zipReader.js";
import { binaryPackageArchive } from "./binaryPackageArchive.js";
import { LaunchpadApiError } from "./client.js";

const resolveArtifactUrl = vi.hoisted(() => vi.fn());
const getArtifactStream = vi.hoisted(() => vi.fn());
vi.mock("./artifacts.js", () => ({ getArtifactStream, resolveArtifactUrl }));

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const FILES_URL = "https://launchpad.test/ubuntu/+archive/primary/+files";
const LIBRARIAN_URL = "https://librarian.test/1";
const FILES = new Map<string, Uint8Array<ArrayBuffer>>([
  ["firefox_1.0_amd64.deb", encoder.encode("amd64")],
  ["firefox_1.0_arm64.deb", encoder.encode("arm")],
]);

function details(
  overrides: Partial<BinaryPackageDetails> = {},
): BinaryPackageDetails {
  return binaryDetails({
    files: Array.from(FILES, ([filename, bytes]) => ({
      filename,
      size: bytes.byteLength,
      url: `${FILES_URL}/${filename}`,
    })),
    ...overrides,
  });
}

function filenameOf(url: string): string {
  return url.slice(url.lastIndexOf("/") + 1);
}

beforeEach(() => {
  resolveArtifactUrl.mockReset();
  getArtifactStream.mockReset();
  resolveArtifactUrl.mockImplementation(
    async (url: string) => `${LIBRARIAN_URL}/${filenameOf(url)}`,
  );
  getArtifactStream.mockImplementation(async (url: string) =>
    new Blob([FILES.get(filenameOf(url)) ?? new Uint8Array()]).stream(),
  );
});

describe("binaryPackageArchive", () => {
  it("streams a stored archive of every artifact with download headers", async () => {
    const response = await binaryPackageArchive(details());
    const { bytes, archive } = await archiveOf(response);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/zip");
    expect(response.headers.get("content-disposition")).toBe(
      'attachment; filename="firefox_1.0.zip"',
    );
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(Number(response.headers.get("content-length"))).toBe(
      bytes.byteLength,
    );
    expect(archive.entries.map((record) => record.name)).toEqual([
      "firefox_1.0_amd64.deb",
      "firefox_1.0_arm64.deb",
    ]);
    expect(
      archive.entries.map((record) => decoder.decode(record.data)),
    ).toEqual(["amd64", "arm"]);
  });

  it.each([
    ["firefox", "1:2.0~beta+1", "firefox_2.0~beta+1.zip"],
    ["libc++1", "3:4", "libc++1_4.zip"],
  ])("names the archive of %s %s %s", async (name, version, filename) => {
    const response = await binaryPackageArchive(
      details({ binary_package_name: name, binary_package_version: version }),
    );
    await response.body?.cancel();

    expect(response.headers.get("content-disposition")).toBe(
      `attachment; filename="${filename}"`,
    );
  });

  it("rejects before responding when an artifact cannot be resolved", async () => {
    resolveArtifactUrl.mockRejectedValue(
      new LaunchpadApiError(404, `${FILES_URL}/firefox_1.0_amd64.deb`),
    );

    await expect(binaryPackageArchive(details())).rejects.toMatchObject({
      name: "LaunchpadApiError",
      status: 404,
    });
    expect(getArtifactStream).not.toHaveBeenCalled();
  });

  it("resolves every artifact URL up front and streams them lazily in order", async () => {
    const response = await binaryPackageArchive(details());

    expect(resolveArtifactUrl.mock.calls.map(([url]) => url)).toEqual([
      `${FILES_URL}/firefox_1.0_amd64.deb`,
      `${FILES_URL}/firefox_1.0_arm64.deb`,
    ]);
    expect(getArtifactStream).not.toHaveBeenCalled();

    await response.arrayBuffer();

    expect(getArtifactStream.mock.calls.map(([url]) => url)).toEqual([
      `${LIBRARIAN_URL}/firefox_1.0_amd64.deb`,
      `${LIBRARIAN_URL}/firefox_1.0_arm64.deb`,
    ]);
  });
});
