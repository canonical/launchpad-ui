import type {
  OwnedKey,
  Superhref,
  SuperhrefParsed,
  SuperhrefSchema,
} from "@canonical/superhref";
import type { Snippet } from "svelte";
import type { HTMLFormAttributes } from "svelte/elements";
import type { ReadonlyURL } from "$app/state";

export type QueryParamsFormSchema<S extends SuperhrefSchema> = Superhref<
  S,
  Record<never, never>
>;

export type QueryParam<S extends SuperhrefSchema> =
  OwnedKey<S> | (keyof SuperhrefParsed<S> & string);

export type QueryParamsFormProps<S extends SuperhrefSchema> = {
  schema: QueryParamsFormSchema<S>;
  url: ReadonlyURL;
  /**
   * Params or sections to replace instead of preserving as hidden inputs.
   * Missing values are cleared; with JavaScript, submitted values are normalized.
   * Other submitted fields pass through unchanged.
   */
  replaceParams: readonly QueryParam<S>[];
  children?: Snippet;
} & Omit<HTMLFormAttributes, "method" | "onformdata">;
