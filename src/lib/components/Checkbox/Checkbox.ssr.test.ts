/* @canonical/generator-ds 0.10.0-experimental.0 */

import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Checkbox.svelte";

describe("Checkbox SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component);
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component);
    expect(body).toContain("<div");
    expect(body).toContain("</div>");
  });

  it("applies class", () => {
    const { body } = render(Component, { props: { class: "test-class" } });
    expect(body).toContain('class="ds checkbox test-class"');
  });
});
