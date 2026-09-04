import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadBinaryPackageArtifacts } from "./binary-package.server.js";

const getBinaryFileUrls = vi.hoisted(() => vi.fn());
vi.mock("$lib/server/launchpad/client.js", () => ({ getBinaryFileUrls }));

beforeEach(() => {
  getBinaryFileUrls.mockReset();
});

describe("loadBinaryPackageArtifacts", () => {
  it("loads every publication and deduplicates artifacts by URL", async () => {
    getBinaryFileUrls
      .mockResolvedValueOnce([
        {
          url: "https://lp.example/files/shared.deb",
          size: 10,
        },
        {
          url: "https://lp.example/files/collision.deb?copy=1",
          size: 20,
        },
      ])
      .mockResolvedValueOnce([
        {
          url: "https://lp.example/files/shared.deb",
          size: 10,
        },
        {
          url: "https://lp.example/files/collision.deb?copy=2",
          size: 20,
        },
      ]);

    const artifacts = await loadBinaryPackageArtifacts([
      {
        selfLink:
          "https://lp.example/api/devel/ubuntu/+archive/primary/+binarypub/1",
        architecture: "amd64",
      },
      {
        selfLink:
          "https://lp.example/api/devel/ubuntu/+archive/primary/+binarypub/2",
        architecture: "arm64",
      },
      {
        selfLink:
          "https://lp.example/api/devel/ubuntu/+archive/primary/+binarypub/1",
        architecture: "s390x",
      },
    ]);

    expect(getBinaryFileUrls).toHaveBeenNthCalledWith(
      1,
      "https://lp.example/api/devel/ubuntu/+archive/primary/+binarypub/1",
    );
    expect(getBinaryFileUrls).toHaveBeenNthCalledWith(
      2,
      "https://lp.example/api/devel/ubuntu/+archive/primary/+binarypub/2",
    );
    expect(artifacts).toEqual([
      {
        id: "https://lp.example/files/shared.deb",
        architecture: "amd64",
        fileName: "shared.deb",
        size: 10,
        url: "https://lp.example/files/shared.deb",
      },
      {
        id: "https://lp.example/files/collision.deb?copy=1",
        architecture: "amd64",
        fileName: "collision.deb",
        size: 20,
        url: "https://lp.example/files/collision.deb?copy=1",
      },
      {
        id: "https://lp.example/files/collision.deb?copy=2",
        architecture: "arm64",
        fileName: "collision.deb",
        size: 20,
        url: "https://lp.example/files/collision.deb?copy=2",
      },
    ]);
  });

  it("runs at most 16 file requests concurrently", async () => {
    let activeRequests = 0;
    let maxActiveRequests = 0;
    const releaseRequests: Array<() => void> = [];
    getBinaryFileUrls.mockImplementation(
      () =>
        new Promise((resolve) => {
          activeRequests += 1;
          maxActiveRequests = Math.max(maxActiveRequests, activeRequests);
          releaseRequests.push(() => {
            activeRequests -= 1;
            resolve([]);
          });
        }),
    );

    const loading = loadBinaryPackageArtifacts(
      Array.from({ length: 17 }, (_, index) => ({
        selfLink: `https://lp.example/+binarypub/${index}`,
        architecture: `architecture-${index}`,
      })),
    );

    await vi.waitFor(() => expect(getBinaryFileUrls).toHaveBeenCalledTimes(16));
    expect(maxActiveRequests).toBe(16);

    releaseRequests.shift()?.();
    await vi.waitFor(() => expect(getBinaryFileUrls).toHaveBeenCalledTimes(17));

    for (const release of releaseRequests) {
      release();
    }
    await loading;

    expect(maxActiveRequests).toBe(16);
  });
});
