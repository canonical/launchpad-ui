import * as v from "valibot";

export type TestObserverImageArtifact = {
  id: number;
  name: string;
  os: string;
  release: string;
  stage: string;
  status: string;
  version: string;
  image_url: string;
  bug_link: string;
  all_environment_reviews_count: number;
  completed_environment_reviews_count: number;
  archived: boolean;
  created_at: string;
};

export const testObserverImageArtifactSchema = v.object({
  id: v.number(),
  name: v.string(),
  os: v.string(),
  release: v.string(),
  stage: v.string(),
  status: v.string(),
  version: v.string(),
  image_url: v.string(),
  bug_link: v.string(),
  all_environment_reviews_count: v.number(),
  completed_environment_reviews_count: v.number(),
  archived: v.boolean(),
  created_at: v.string(),
});
