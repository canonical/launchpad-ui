import * as v from "valibot";
import { testObserverImageArtifactSchema } from "./types.js";
import type { TestObserverImageArtifact } from "./types.js";

const IMAGE_ARTIFACTS_URL =
  "https://tests-api.ubuntu.com/v1/artefacts?family=image";

export async function getImageArtifacts(): Promise<
  TestObserverImageArtifact[]
> {
  const response = await fetch(IMAGE_ARTIFACTS_URL, {
    headers: { accept: "application/json" },
  });

  if (!response.ok)
    throw new TestObserverApiError(response.status, IMAGE_ARTIFACTS_URL);

  return v.parse(
    v.array(testObserverImageArtifactSchema),
    await response.json(),
  );
}

export class TestObserverApiError extends Error {
  constructor(
    public readonly status: number,
    url: string,
  ) {
    super(`Test Observer request to ${url} failed with status ${status}`);
    this.name = "TestObserverApiError";
  }
}
