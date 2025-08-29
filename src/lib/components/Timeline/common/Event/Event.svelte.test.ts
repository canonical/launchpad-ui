/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Event.svelte";

const children = createRawSnippet(() => ({
  render: () => "Child Content",
}));

const titleRow = createRawSnippet(() => ({
  render: () => "Title Row Content",
}));

describe("Event component", () => {
  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { id: "test-id" });
      await expect
        .element(page.getByRole("listitem"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, { class: "test-class" });
      await expect
        .element(page.getByRole("listitem"))
        .toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, { style: "color: red;" });
      await expect
        .element(page.getByRole("listitem"))
        .toHaveStyle("color: red;");
    });
  });

  describe("Renders", () => {
    it("as list item", async () => {
      const page = render(Component);
      await expect.element(page.getByRole("listitem")).toBeInTheDocument();
    });

    it("renders children", async () => {
      const page = render(Component, { children });
      await expect.element(page.getByText("Child Content")).toBeInTheDocument();
    });

    it("renders title row", async () => {
      const page = render(Component, { titleRow });
      await expect
        .element(page.getByText("Title Row Content"))
        .toBeInTheDocument();
      await expect
        .element(page.getByRole("listitem"))
        .toHaveClass("with-title-row");
    });

    describe("Marker", () => {
      it("empty by default", async () => {
        const page = render(Component);
        const element = page.getByRole("listitem");
        await expect.element(element).toHaveClass("marker-empty");
        expect(element.element().querySelector(".marker")).toBeInTheDocument();
      });

      it("small", async () => {
        const page = render(Component, {
          marker: "anchor",
          markerSize: "small",
        });
        const element = page.getByRole("listitem");
        await expect.element(element).toHaveClass("marker-small");
        expect(element.element().querySelector(".marker")).toBeInTheDocument();
      });

      it("large", async () => {
        const page = render(Component, {
          marker: { userName: "John Doe" },
          markerSize: "large",
        });
        const element = page.getByRole("listitem");
        await expect.element(element).toHaveClass("marker-large");
        expect(element.element().querySelector(".marker")).toBeInTheDocument();
      });
    });
  });
});
