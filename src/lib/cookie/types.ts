import type { CookieSerializeOptions } from "cookie";
import type * as v from "valibot";

export type CookieOptions = CookieSerializeOptions & { path: string };
export type CookieDefinition<
  TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
> = {
  name: string;
  schema: TSchema;
  defaultValue: v.InferInput<TSchema>;
  options: CookieOptions;
};
