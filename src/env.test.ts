import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { variables } from "./env.js";

describe("Environment variables", () => {
  describe("MAIN_LAUNCHPAD_BASE_HOST", () => {
    const { schema } = variables.MAIN_LAUNCHPAD_BASE_HOST;

    it("defaults to https://launchpad.net when unset", () => {
      expect(v.parse(schema, undefined)).toBe("https://launchpad.net");
    });

    it("rejects an empty string", () => {
      expect(() => v.parse(schema, "")).toThrow(v.ValiError);
    });

    it("accepts a configured URL", () => {
      const url = "https://launchpad.example:8443";
      expect(v.parse(schema, url)).toBe(url);
    });

    it("rejects an invalid URL", () => {
      expect(() => v.parse(schema, "not-a-url")).toThrow(v.ValiError);
    });
  });

  describe("MAIN_LAUNCHPAD_COOKIE_NAME", () => {
    const { schema } = variables.MAIN_LAUNCHPAD_COOKIE_NAME;

    it("defaults to lp when unset", () => {
      expect(v.parse(schema, undefined)).toBe("lp");
    });

    it("rejects an empty string", () => {
      expect(() => v.parse(schema, "")).toThrow(v.ValiError);
    });

    it("accepts a configured cookie name", () => {
      expect(v.parse(schema, "launchpad_dev")).toBe("launchpad_dev");
    });
  });

  describe("MAIN_LAUNCHPAD_IP_ADDRESS", () => {
    const { schema } = variables.MAIN_LAUNCHPAD_IP_ADDRESS;

    it("remains undefined when unset", () => {
      expect(v.parse(schema, undefined)).toBeUndefined();
    });

    it("rejects an empty string", () => {
      expect(() => v.parse(schema, "")).toThrow(v.ValiError);
    });

    it("accepts a configured URL", () => {
      const url = "https://launchpad.example:8443";
      expect(v.parse(schema, url)).toBe(url);
    });

    it("rejects an invalid URL", () => {
      expect(() => v.parse(schema, "not-a-url")).toThrow(v.ValiError);
    });
  });

  describe("MAIN_LAUNCHPAD_SKIP_TLS_VERIFY", () => {
    const { schema } = variables.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY;

    it("defaults to false when unset", () => {
      expect(v.parse(schema, undefined)).toBe(false);
    });

    it("rejects an empty string", () => {
      expect(() => v.parse(schema, "")).toThrow(v.ValiError);
    });

    it.each([
      ["true", true],
      ["false", false],
    ] as const)("maps TLS setting %j to boolean %j", (value, expected) => {
      expect(v.parse(schema, value)).toBe(expected);
    });

    it.each(["TRUE", "False", "yes", "1", "0", " true "])(
      "rejects invalid TLS setting %j",
      (value) => {
        expect(() => v.parse(schema, value)).toThrow(v.ValiError);
      },
    );
  });
});
