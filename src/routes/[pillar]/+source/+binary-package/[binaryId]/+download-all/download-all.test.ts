import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, HEAD } from "./+server.js";

const getBinaryPackage = vi.hoisted(() => vi.fn());
vi.mock(
  "$lib/modules/packages/binary-package/binary-package.remote.js",
  () => ({ getBinaryPackage }),
);

const binaryPackageArchive = vi.hoisted(() => vi.fn());
vi.mock("$lib/server/launchpad/binaryPackageArchive.js", () => ({
  binaryPackageArchive,
}));

const event = {
  params: { pillar: "ubuntu", binaryId: "101" },
} as unknown as Parameters<typeof GET>[0];
const details = { id: 101 };

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  getBinaryPackage.mockReset();
  getBinaryPackage.mockResolvedValue(details);
  binaryPackageArchive.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("download-all endpoint", () => {
  it("GET loads the details through the remote query and streams the archive", async () => {
    const archive = new Response("zip");
    binaryPackageArchive.mockResolvedValueOnce(archive);

    await expect(GET(event)).resolves.toBe(archive);

    expect(getBinaryPackage).toHaveBeenCalledWith({
      distro: "ubuntu",
      binaryId: "101",
    });
    expect(binaryPackageArchive).toHaveBeenCalledWith(details);
  });

  it("GET answers 502 when the artifacts cannot be fetched", async () => {
    const cause = new Error("librarian is down");
    binaryPackageArchive.mockRejectedValueOnce(cause);

    await expect(GET(event)).rejects.toMatchObject({
      status: 502,
      body: {
        message:
          "Couldn't fetch the artifacts of this binary package from Launchpad. Try again shortly.",
      },
    });
    expect(console.error).toHaveBeenCalledWith(
      "Failed to resolve binary package artifacts",
      cause,
    );
  });

  it("HEAD answers with the archive headers and no body", async () => {
    const cancel = vi.fn();
    binaryPackageArchive.mockResolvedValueOnce(
      new Response(new ReadableStream({ cancel }), {
        headers: { "content-length": "42", "content-type": "application/zip" },
      }),
    );

    const response = await HEAD(event);

    expect(response.status).toBe(200);
    expect(response.body).toBeNull();
    expect(response.headers.get("content-length")).toBe("42");
    expect(response.headers.get("content-type")).toBe("application/zip");
    expect(cancel).toHaveBeenCalledTimes(1);
  });
});
