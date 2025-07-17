/* @canonical/generator-ds 0.9.0-experimental.22 */

import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Tab.svelte";

describe("Tab component", () => {
  describe("base properties", () => {
    it("applies id", async () => {
      const page = render(Component, {
        props: { id: "test-id", href: "/test" },
      });
      const element = page.getByRole("link");
      await expect.element(element).toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, {
        props: { class: "custom-class", href: "/test" },
      });
      const element = page.getByRole("link");
      await expect.element(element).toHaveClass("custom-class");
    });

    it("applies style", async () => {
      const page = render(Component, {
        props: { style: "color: red;", href: "/test" },
      });
      const element = page.getByRole("link");
      await expect.element(element).toHaveStyle("color: red;");
    });

    it("applies aria-attributes", async () => {
      const page = render(Component, {
        props: { "aria-disabled": "true", href: "/test" },
      });
      const element = page.getByRole("link");
      await expect.element(element).toHaveAttribute("aria-disabled", "true");
    });

    it("applies href", async () => {
      const page = render(Component, { props: { href: "/test" } });
      const element = page.getByRole("link");
      await expect.element(element).toHaveAttribute("href", "/test");
    });

    it("can be active", async () => {
      const page = render(Component, {
        props: { href: "/test", active: true },
      });
      const element = page.getByRole("link");
      await expect.element(element).toHaveClass("active");
    });
  });
});
