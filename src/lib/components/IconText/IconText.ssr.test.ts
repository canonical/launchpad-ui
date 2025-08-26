/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./IconText.svelte";

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
});
