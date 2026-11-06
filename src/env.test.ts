import { describe, expect, it } from "vitest";
import { isRejected, parse } from "../test/standard-schema.js";
import { variables } from "./env.js";

describe("Environment variables", () => {
  describe("MAIN_LAUNCHPAD_BASE_HOST", () => {
    const { schema } = variables.MAIN_LAUNCHPAD_BASE_HOST;

    it("defaults to https://launchpad.net when unset", () => {
      expect(parse(schema, undefined)).toBe("https://launchpad.net");
    });

    it("rejects an empty string", () => {
      expect(isRejected(schema, "")).toBe(true);
    });

    it("accepts a configured URL", () => {
      const url = "https://launchpad.example:8443";
      expect(parse(schema, url)).toBe(url);
    });

    it("rejects an invalid URL", () => {
      expect(isRejected(schema, "not-a-url")).toBe(true);
    });
  });

  describe("MAIN_LAUNCHPAD_COOKIE_NAME", () => {
    const { schema } = variables.MAIN_LAUNCHPAD_COOKIE_NAME;

    it("defaults to lp when unset", () => {
      expect(parse(schema, undefined)).toBe("lp");
    });

    it("rejects an empty string", () => {
      expect(isRejected(schema, "")).toBe(true);
    });

    it("accepts a configured cookie name", () => {
      expect(parse(schema, "launchpad_dev")).toBe("launchpad_dev");
    });
  });

  describe("MAIN_LAUNCHPAD_IP_ADDRESS", () => {
    const { schema } = variables.MAIN_LAUNCHPAD_IP_ADDRESS;

    it("remains undefined when unset", () => {
      expect(parse(schema, undefined)).toBeUndefined();
    });

    it("rejects an empty string", () => {
      expect(isRejected(schema, "")).toBe(true);
    });

    it("accepts a configured URL", () => {
      const url = "https://launchpad.example:8443";
      expect(parse(schema, url)).toBe(url);
    });

    it("rejects an invalid URL", () => {
      expect(isRejected(schema, "not-a-url")).toBe(true);
    });
  });

  describe("MAIN_LAUNCHPAD_SKIP_TLS_VERIFY", () => {
    const { schema } = variables.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY;

    it("defaults to false when unset", () => {
      expect(parse(schema, undefined)).toBe(false);
    });

    it("rejects an empty string", () => {
      expect(isRejected(schema, "")).toBe(true);
    });

    it.each([
      ["true", true],
      ["false", false],
    ] as const)("maps TLS setting %j to boolean %j", (value, expected) => {
      expect(parse(schema, value)).toBe(expected);
    });

    it.each(["TRUE", "False", "yes", "1", "0", " true "])(
      "rejects invalid TLS setting %j",
      (value) => {
        expect(isRejected(schema, value)).toBe(true);
      },
    );
  });
});
