import { HttpResponse } from "msw";
import type { ErrorResponse } from "../../../types.js";

export const notFoundResponse = (detail: string) =>
  HttpResponse.json<ErrorResponse>(
    { detail, code: "not_found" },
    { status: 404 },
  );

export const badRequestResponse = (detail: string) =>
  HttpResponse.json<ErrorResponse>(
    { detail, code: "bad_request" },
    { status: 400 },
  );

export const methodNotAllowedResponse = (detail: string) =>
  HttpResponse.json<ErrorResponse>(
    { detail, code: "method_not_allowed" },
    { status: 405 },
  );

export const sourcePackageNotFound = (name: string) =>
  notFoundResponse(`Source package ${name} not found`);

export const versionNotFound = (name: string, version: string) =>
  notFoundResponse(
    `Version ${version} of source package ${name} not found`,
  );
