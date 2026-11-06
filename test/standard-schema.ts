import type { StandardSchemaV1 } from "@standard-schema/spec";

function validateSync<S extends StandardSchemaV1>(
  schema: S,
  value: unknown,
): StandardSchemaV1.Result<StandardSchemaV1.InferOutput<S>> {
  const result = schema["~standard"].validate(value);
  if (result instanceof Promise) {
    throw new Error("Expected a synchronous schema");
  }
  return result;
}

export function parse<S extends StandardSchemaV1>(
  schema: S,
  value: unknown,
): StandardSchemaV1.InferOutput<S> {
  const result = validateSync(schema, value);
  if (result.issues) {
    throw new Error(result.issues.map((issue) => issue.message).join("\n"));
  }
  return result.value;
}

export function isRejected<S extends StandardSchemaV1>(
  schema: S,
  value: unknown,
): boolean {
  return validateSync(schema, value).issues !== undefined;
}
