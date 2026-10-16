import * as v from "valibot";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { TestObserverApiError, getImageArtifacts } from "./client.js";
import type { TestObserverImageArtifact } from "./types.js";

function artifact(
  overrides: Partial<TestObserverImageArtifact> = {},
): TestObserverImageArtifact {
  return {
    id: 1,
    name: "resolute-desktop-amd64.iso",
    os: "ubuntu",
    release: "resolute",
    stage: "pending",
    status: "UNDECIDED",
    version: "20261016",
    image_url: "https://example.com/resolute-desktop-amd64.iso",
    bug_link: "",
    all_environment_reviews_count: 2,
    completed_environment_reviews_count: 0,
    archived: false,
    created_at: "2026-10-16T05:04:50.101354",
    ...overrides,
  };
}

let fetcher: MockInstance<typeof fetch>;

function respondWith(body: unknown, status = 200) {
  fetcher.mockResolvedValue(Response.json(body, { status }));
}

beforeEach(() => {
  fetcher = vi.spyOn(globalThis, "fetch");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getImageArtifacts", () => {
  it("fetches image artefacts from the API", async () => {
    const body = [artifact(), artifact({ id: 2, os: "ubuntustudio" })];
    respondWith(body);

    await expect(getImageArtifacts()).resolves.toEqual(body);
    expect(fetcher).toHaveBeenCalledExactlyOnceWith(
      "https://tests-api.ubuntu.com/v1/artefacts?family=image",
      { headers: { accept: "application/json" } },
    );
  });

  it("returns an empty collection without additional requests", async () => {
    respondWith([]);

    await expect(getImageArtifacts()).resolves.toEqual([]);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("strips fields outside the artifact schema", async () => {
    const body = artifact();
    respondWith([{ ...body, reviewers: [], assignee: null }]);

    await expect(getImageArtifacts()).resolves.toEqual([body]);
  });

  it.each([404, 503])("preserves upstream status %i", async (status) => {
    respondWith({}, status);

    const request = getImageArtifacts();
    await expect(request).rejects.toBeInstanceOf(TestObserverApiError);
    await expect(request).rejects.toMatchObject({
      name: "TestObserverApiError",
      status,
      message: `Test Observer request to https://tests-api.ubuntu.com/v1/artefacts?family=image failed with status ${status}`,
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("propagates network failures without retrying", async () => {
    const failure = new TypeError("Connection failed");
    fetcher.mockRejectedValue(failure);

    await expect(getImageArtifacts()).rejects.toBe(failure);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it.each([
    {},
    null,
    [{ id: 1 }],
    [{ ...artifact(), id: "1" }],
    [{ ...artifact(), archived: "false" }],
    [{ ...artifact(), all_environment_reviews_count: "2" }],
    [artifact(), { id: 2 }],
  ])("rejects malformed API data: %j", async (body) => {
    respondWith(body);

    await expect(getImageArtifacts()).rejects.toBeInstanceOf(v.ValiError);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("propagates invalid JSON responses", async () => {
    fetcher.mockResolvedValue(new Response("not JSON"));

    await expect(getImageArtifacts()).rejects.toBeInstanceOf(SyntaxError);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
