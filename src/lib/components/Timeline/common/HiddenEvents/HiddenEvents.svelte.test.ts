/* @canonical/generator-ds 0.10.0-experimental.2 */

import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./HiddenEvents.svelte";

describe("HiddenEvents component", () => {
  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { id: "test-id", numHidden: 0 });
      await expect
        .element(page.getByRole("listitem"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, { class: "test-class", numHidden: 0 });
      await expect
        .element(page.getByRole("listitem"))
        .toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, { style: "color: red;", numHidden: 0 });
      await expect
        .element(page.getByRole("listitem"))
        .toHaveStyle("color: red;");
    });
  });

  describe("Renders", () => {
    it("as list item", async () => {
      const page = render(Component, { numHidden: 0 });
      await expect.element(page.getByRole("listitem")).toBeInTheDocument();
    });

    it("hidden events number", async () => {
      const page = render(Component, { numHidden: 888 });
      await expect.element(page.getByRole("listitem")).toHaveTextContent("888");
    });

    describe("Links", () => {
      it("without the links by default", async () => {
        const page = render(Component, { numHidden: 0 });
        await expect.element(page.getByRole("link")).not.toBeInTheDocument();
      });

      it("with show more link", async () => {
        const page = render(Component, {
          numHidden: 0,
          showMoreHref: "/show-more",
        });
        await expect
          .element(page.getByRole("link"))
          .toHaveAttribute("href", "/show-more");
      });

      it("with show all link", async () => {
        const page = render(Component, {
          numHidden: 0,
          showAllHref: "/show-all",
        });
        await expect
          .element(page.getByRole("link"))
          .toHaveAttribute("href", "/show-all");
      });

      it("with both links at once", async () => {
        const page = render(Component, {
          numHidden: 0,
          showMoreHref: "/show-more",
          showAllHref: "/show-all",
        });
        await expect
          .element(page.getByRole("link", { name: "Show more" }))
          .toHaveAttribute("href", "/show-more");
        await expect
          .element(page.getByRole("link", { name: "Show all" }))
          .toHaveAttribute("href", "/show-all");
      });
    });
  });
});
