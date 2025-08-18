/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./IconText.svelte";
import { iconTextModifiers } from "./modifiers";
import type { IconTextModifiers } from "./modifiers";

describe("IconText SSR", () => {
  const icon = createRawSnippet(() => ({
    render: () => "<span>Icon</span>",
  }));
  const children = createRawSnippet(() => ({
    render: () => "<span>Text</span>",
  }));

  it("doesn't throw and renders", () => {
    expect(() => {
      const { body } = render(Component, {
        props: {
          icon,
          children,
        },
      });
      expect(body).toContain("<span>Icon</span>");
      expect(body).toContain("<span>Text</span>");
    }).not.toThrow();
  });

  describe("modifiers", () => {
    it.each(iconTextModifiers)("renders with %s modifier class", (modifier) => {
      const { body } = render(Component, {
        props: {
          icon,
          children,
          modifiers: [modifier],
        },
      });

      expect(body).toContain(modifier);
      const otherModifiers = iconTextModifiers
        .filter((m) => m !== modifier)
        .map((m) => m ?? "");
      expect(body).not.toContain(otherModifiers);
    });

    it("renders multiple modifiers", async () => {
      const modifiers: IconTextModifiers = ["job-success", "small"];
      const { body } = render(Component, {
        props: {
          icon,
          children,
          modifiers,
        },
      });
      expect(body).toContain(modifiers.join(" "));
      const otherModifiers = iconTextModifiers
        .filter((m) => !modifiers.includes(m))
        .map((m) => m ?? "");
      expect(body).not.toContain(otherModifiers);
    });
  });
});
