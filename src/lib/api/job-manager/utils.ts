import type { ValidationError } from "./types";

export const extractErrorMessage = (
  error:
    | {
        detail?: ValidationError[] | string;
      }
    | string,
) => {
  if (typeof error === "string") {
    return error;
  }

  if (typeof error.detail === "string") {
    return error.detail;
  }

  if (Array.isArray(error.detail)) {
    return error.detail.map((e) => e.msg).join(", ");
  }

  return "An unknown error occurred";
};
