import { beforeEach, describe, expect, it, vi } from "vitest";
import { getArtifactStream, resolveArtifactUrl } from "./artifacts.js";

const launchpadFetchStream = vi.hoisted(() => vi.fn());
vi.mock("./launchpadFetch.js", () => ({
  launchpadFetch: vi.fn(),
  launchpadFetchStream,
}));

const ARTIFACT_URL =
  "https://lp.example/ubuntu/+archive/primary/+files/hello_2.12.3-1_s390x.deb";
const LIBRARIAN_URL =
  "https://launchpadlibrarian.net/861919804/hello_2.12.3-1_s390x.deb";
const HEADERS = { "accept-encoding": "identity" };

function redirectTo(location: string): Response {
  return new Response(null, { status: 303, headers: { location } });
}

function bodyWith(cancel: () => void, status = 200): Response {
  return new Response(new ReadableStream({ cancel }), { status });
}

beforeEach(() => {
  launchpadFetchStream.mockReset();
});

describe("resolveArtifactUrl", () => {
  it("follows the redirect chain with HEAD and returns the final URL", async () => {
    const cancel = vi.fn();
    launchpadFetchStream
      .mockResolvedValueOnce(redirectTo(LIBRARIAN_URL))
      .mockResolvedValueOnce(bodyWith(cancel));

    await expect(resolveArtifactUrl(ARTIFACT_URL)).resolves.toBe(LIBRARIAN_URL);

    expect(launchpadFetchStream.mock.calls).toEqual([
      [ARTIFACT_URL, { method: "HEAD", headers: HEADERS }],
      [LIBRARIAN_URL, { method: "HEAD", headers: HEADERS }],
    ]);
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it.each([404, 500])(
    "throws a LaunchpadApiError with upstream status %i",
    async (status) => {
      launchpadFetchStream.mockResolvedValueOnce(
        new Response(null, { status }),
      );

      await expect(resolveArtifactUrl(ARTIFACT_URL)).rejects.toMatchObject({
        name: "LaunchpadApiError",
        status,
      });
    },
  );
});

describe("getArtifactStream", () => {
  it("returns the body of a successful GET", async () => {
    launchpadFetchStream.mockResolvedValueOnce(new Response("payload"));

    const stream = await getArtifactStream(LIBRARIAN_URL);

    await expect(new Response(stream).text()).resolves.toBe("payload");
    expect(launchpadFetchStream.mock.calls).toEqual([
      [LIBRARIAN_URL, { headers: HEADERS }],
    ]);
  });

  it("throws with the upstream status and cancels the body on failure", async () => {
    const cancel = vi.fn();
    launchpadFetchStream.mockResolvedValueOnce(bodyWith(cancel, 404));

    await expect(getArtifactStream(LIBRARIAN_URL)).rejects.toMatchObject({
      name: "LaunchpadApiError",
      status: 404,
    });
    expect(cancel).toHaveBeenCalledTimes(1);
  });
});
