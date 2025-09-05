/* @canonical/generator-ds 0.10.0-experimental.2 */

import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./TextInput.svelte";
import { textInputModifiers } from "./modifiers.js";

describe("TextInput component", () => {
  it("renders", async () => {
    const page = render(Component);
    await expect.element(page.getByRole("textbox")).toBeVisible();
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, {
        props: { id: "test-id" },
      });
      await expect
        .element(page.getByRole("textbox"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, {
        props: { class: "test-class" },
      });
      await expect.element(page.getByRole("textbox")).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, {
        props: { style: "color: red;" },
      });
      await expect
        .element(page.getByRole("textbox"))
        .toHaveStyle("color: red;");
    });
  });

  describe("Input attributes", () => {
    describe("type", () => {
      it("defaults to text", async () => {
        const page = render(Component);
        await expect
          .element(page.getByRole("textbox"))
          .toHaveAttribute("type", "text");
      });

      it.each(["text", "password", "email", "url", "tel"] as const)(
        "accepts %s",
        async (type) => {
          const page = render(Component, {
            props: { type },
          });
          await expect
            .element(page.getByRole("textbox"))
            .toHaveAttribute("type", type);
        },
      );

      it("accepts search", async () => {
        const page = render(Component, {
          props: { type: "search" },
        });
        await expect
          .element(page.getByRole("searchbox"))
          .toHaveAttribute("type", "search");
      });
    });

    it("applies value", async () => {
      const page = render(Component, {
        props: { value: "Test value" },
      });
      await expect.element(page.getByRole("textbox")).toHaveValue("Test value");
    });

    describe("Disabled state", () => {
      it("isn't disabled by default", async () => {
        const page = render(Component);
        await expect.element(page.getByRole("textbox")).not.toBeDisabled();
      });

      it("can be disabled", async () => {
        const page = render(Component, {
          props: { disabled: true },
        });
        await expect.element(page.getByRole("textbox")).toBeDisabled();
      });
    });
  });

  describe("Validation attributes", () => {
    it("applies required", async () => {
      const page = render(Component, {
        props: { required: true },
      });
      const input = page.getByRole("textbox");

      await expect.element(input).toBeRequired();
      await expect.element(input).toBeInvalid();

      await input.fill("Some value");
      await expect.element(input).toBeValid();
    });

    it("minlength", async () => {
      const page = render(Component, {
        props: { minlength: 5 },
      });
      const input = page.getByRole("textbox");

      await expect.element(input).toHaveAttribute("minlength", "5");

      await input.fill("1234");
      await expect.element(input).toBeInvalid();

      await input.fill("12345");
      await expect.element(input).toBeValid();
    });
  });

  describe("Modifiers", () => {
    it.each(textInputModifiers["severity"])(
      "applies %s severity modifier",
      async (modifier) => {
        const page = render(Component, {
          props: { modifiers: { severity: modifier } },
        });
        await expect.element(page.getByRole("textbox")).toHaveClass(modifier);
      },
    );

    it.each(textInputModifiers["density"])(
      "applies %s density modifier",
      async (modifier) => {
        const page = render(Component, {
          props: { modifiers: { density: modifier } },
        });
        await expect.element(page.getByRole("textbox")).toHaveClass(modifier);
      },
    );
  });
});
