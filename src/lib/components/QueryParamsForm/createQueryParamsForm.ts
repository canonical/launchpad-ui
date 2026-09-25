import type {
  SuperhrefPatchInput,
  SuperhrefSchema,
} from "@canonical/superhref";
import type { QueryParam, QueryParamsFormSchema } from "./types.js";

export type FormDataEntries = readonly (readonly [
  name: string,
  value: string,
])[];

export type FormDataPatch = Readonly<Record<string, readonly string[]>>;

export type QueryParamsFormBindings = {
  preserveParams: [name: string, value: string][];
  patch: (entries: FormDataEntries) => FormDataPatch;
};

export function createQueryParamsForm<S extends SuperhrefSchema>(
  schema: QueryParamsFormSchema<S>,
  url: URL,
  replaceParams: readonly QueryParam<S>[],
): QueryParamsFormBindings {
  return {
    preserveParams: Array.from(url.searchParams).filter(
      ([name]) => !replaceParams.some((key) => belongsTo(name, key)),
    ),
    patch: (entries) => {
      const submitted = new URL(url);
      submitted.search = String(
        new URLSearchParams(entries.map(([name, value]) => [name, value])),
      );
      const parsed = schema.parse(submitted);
      const payload = Object.fromEntries(
        replaceParams.map((key) => [
          key,
          entries.some(([name]) => belongsTo(name, key)) ? parsed[key] : null,
        ]),
      ) as SuperhrefPatchInput<S>;
      const patched = schema.patch(url, payload).searchParams;
      const names = new Set([
        ...entries.map(([name]) => name),
        ...patched.keys(),
      ]);
      const patch: Record<string, readonly string[]> = {};
      for (const name of names) {
        if (!replaceParams.some((key) => belongsTo(name, key))) continue;
        const values = patched.getAll(name);
        if (!valuesMatch(valuesOf(entries, name), values)) {
          patch[name] = values;
        }
      }
      return patch;
    },
  };
}

function belongsTo(name: string, key: string): boolean {
  return name === key || name.startsWith(`${key}.`);
}

function valuesOf(entries: FormDataEntries, name: string): string[] {
  return entries.flatMap(([entryName, value]) =>
    entryName === name ? [value] : [],
  );
}

function valuesMatch(
  current: readonly string[],
  values: readonly string[],
): boolean {
  return (
    values.length === current.length &&
    values.every((value, index) => value === current[index])
  );
}
