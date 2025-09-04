/* @canonical/generator-ds 0.10.0-experimental.2 */

import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./TextInput.svelte";

describe("TextInput SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component);
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component);
    expect(body).toContain("<input");
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

  describe("Input attributes", () => {
    describe("type", () => {
      it("defaults to text", () => {
        const { body } = render(Component);
        expect(body).toContain('type="text"');
      });

      it.each(["text", "password", "email", "url", "tel", "search"] as const)(
        "accepts %s",
        (type) => {
          const { body } = render(Component, {
            props: { type },
          });
          expect(body).toContain(`type="${type}"`);
        },
      );
    });

    it("applies value", () => {
      const { body } = render(Component, {
        props: { value: "test value" },
      });
      expect(body).toContain('value="test value"');
    });

    it("applies validation attributes", () => {
      const { body } = render(Component, {
        props: {
          required: true,
          minlength: 5,
          maxlength: 10,
          pattern: "[A-Za-z]+",
        },
      });
      expect(body).toContain("required");
      expect(body).toContain('minlength="5"');
      expect(body).toContain('maxlength="10"');
      expect(body).toContain('pattern="[A-Za-z]+"');
    });
  });
});
