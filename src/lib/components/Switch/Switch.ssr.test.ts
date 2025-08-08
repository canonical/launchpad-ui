/* @canonical/generator-ds 0.10.0-experimental.0 */

import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Switch.svelte";

describe("Switch SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component);
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component);
    expect(body).toContain('<input type="checkbox" role="switch"');
  });

  describe("Basic attributes", () => {
    it("applies id", () => {
      const { body } = render(Component, { props: { id: "test-id" } });
      expect(body).toContain('id="test-id"');
    });

    it("applies class", () => {
      const { body } = render(Component, { props: { class: "test-class" } });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies style", () => {
      const { body } = render(Component, { props: { style: "color: red;" } });
      expect(body).toContain('style="color: red;"');
    });
  });

  describe("Switch state", () => {
    it("doesn't include aria-checked attribute", () => {
      const { body: bodyDefault } = render(Component);
      const { body: bodyChecked } = render(Component, {
        props: { checked: true },
      });
      const { body: bodyNotChecked } = render(Component, {
        props: { checked: false },
      });

      expect(bodyDefault).not.toContain("aria-checked");
      expect(bodyChecked).not.toContain("aria-checked");
      expect(bodyNotChecked).not.toContain("aria-checked");
    });

    it("is not checked by default", () => {
      const { body } = render(Component);
      expect(body).not.toContain("checked");
    });

    it("can be checked", () => {
      const { body } = render(Component, { props: { checked: true } });
      expect(body).toContain("checked");
    });

    it("isn't disabled by default", () => {
      const { body } = render(Component);
      expect(body).not.toContain('aria-readonly="true"');
    });

    it("can be disabled", () => {
      const { body } = render(Component, { props: { disabled: true } });
      expect(body).toContain('aria-readonly="true"');
      expect(body).toContain("disabled");
    });
  });
});
