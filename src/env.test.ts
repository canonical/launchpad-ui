import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { variables } from "./env.js";

describe("environment variables", () => {
  it("provides defaults for unset variables", () => {
    expect(v.parse(variables.MAIN_LAUNCHPAD_BASE_HOST.schema, undefined)).toBe(
      "https://launchpad.net",
    );
    expect(
      v.parse(variables.MAIN_LAUNCHPAD_COOKIE_NAME.schema, undefined),
    ).toBe("lp");
    expect(
      v.parse(variables.MAIN_LAUNCHPAD_IP_ADDRESS.schema, undefined),
    ).toBeUndefined();
    expect(
      v.parse(variables.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY.schema, undefined),
    ).toBe(false);
  });

  it.each(Object.entries(variables))("rejects an empty %s", (_, { schema }) => {
    expect(() => v.parse(schema, "")).toThrow(v.ValiError);
  });

  describe.each([
    "MAIN_LAUNCHPAD_BASE_HOST",
    "MAIN_LAUNCHPAD_IP_ADDRESS",
  ] as const)("%s", (name) => {
    it("accepts a configured URL", () => {
      const url = "https://launchpad.example:8443";
      expect(v.parse(variables[name].schema, url)).toBe(url);
    });

    it("rejects an invalid URL", () => {
      expect(() => v.parse(variables[name].schema, "not-a-url")).toThrow(
        v.ValiError,
      );
    });
  });

  it("accepts a configured cookie name", () => {
    expect(
      v.parse(variables.MAIN_LAUNCHPAD_COOKIE_NAME.schema, "launchpad_dev"),
    ).toBe("launchpad_dev");
  });

  it.each([
    ["true", true],
    ["false", false],
  ] as const)("maps TLS setting %j to boolean %j", (value, expected) => {
    expect(
      v.parse(variables.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY.schema, value),
    ).toBe(expected);
  });

  it.each(["TRUE", "False", "yes", "1", "0", " true "])(
    "rejects invalid TLS setting %j",
    (value) => {
      expect(() =>
        v.parse(variables.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY.schema, value),
      ).toThrow(v.ValiError);
    },
  );
});
