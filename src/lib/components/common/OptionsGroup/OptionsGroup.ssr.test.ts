/* @canonical/generator-ds 0.10.0-experimental.0 */

import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./OptionsGroup.svelte";

describe("Group SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component);
    }).not.toThrow();
  });

  describe("renders", () => {
    it("the fieldset", () => {
      const { body } = render(Component);
      expect(body).toContain("<fieldset");
      expect(body).toContain("</fieldset>");
    });

    it("no legend by default", () => {
      const { body } = render(Component);
      expect(body).not.toContain("<legend");
    });

    it("the legend with group title", () => {
      const { body } = render(Component, {
        props: { groupTitle: "Group Title" },
      });

      expect(body).toContain("<legend");
      expect(body).toContain("Group Title");
      expect(body).toContain("</legend>");
    });
  });

  describe("Basic attributes", () => {
    it("applies id", () => {
      const { body } = render(Component, {
        props: { id: "test-id" },
      });
      expect(body).toContain('id="test-id"');
    });

    it("applies class", () => {
      const { body } = render(Component, {
        props: { class: "test-class" },
      });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies style", () => {
      const { body } = render(Component, {
        props: { style: "color: red;" },
      });
      expect(body).toContain('style="color: red;"');
    });
  });

  describe("Disabled state", () => {
    it("is not disabled by default", () => {
      const { body } = render(Component);
      expect(body).not.toContain("disabled");
    });

    it("can be disabled", () => {
      const { body } = render(Component, {
        props: { disabled: true },
      });
      expect(body).toContain("disabled");
    });
  });
});
