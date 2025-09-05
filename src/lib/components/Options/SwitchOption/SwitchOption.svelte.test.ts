/* @canonical/generator-ds 0.10.0-experimental.0 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./SwitchOption.svelte";

describe("SwitchOption component", () => {
  describe("Renders", () => {
    it("renders", async () => {
      const page = render(Component, { text: "Option" });
      await expect.element(page.getByRole("switch")).toBeInTheDocument();
    });

    it("renders secondary text", async () => {
      const page = render(Component, {
        text: "Option",
        secondaryText: "Secondary",
      });
      await expect.element(page.getByText("Secondary")).toBeInTheDocument();
    });

    it("renders trailing text", async () => {
      const page = render(Component, {
        text: "Option",
        trailingText: "Trailing",
      });
      await expect.element(page.getByText("Trailing")).toBeInTheDocument();
    });

    it("renders icon", async () => {
      const icon = "<span data-testid='icon'>Icon</span>";
      const page = render(Component, {
        text: "Option",
        icon: createRawSnippet(() => ({ render: () => icon })),
      });
      await expect.element(page.getByTestId("icon")).toBeInTheDocument();
    });
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { text: "Option", id: "test-id" });
      await expect
        .element(page.getByTestId("switch-option"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, { text: "Option", class: "test-class" });
      await expect
        .element(page.getByTestId("switch-option"))
        .toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, { text: "Option", style: "color: red;" });
      await expect
        .element(page.getByTestId("switch-option"))
        .toHaveStyle("color: red;");
    });
  });

  describe("Checked state", () => {
    it("is not checked by default", async () => {
      const page = render(Component, { text: "Option" });
      await expect.element(page.getByRole("switch")).not.toBeChecked();
    });

    it("can be checked", async () => {
      const page = render(Component, { text: "Option", checked: true });
      await expect.element(page.getByRole("switch")).toBeChecked();
    });
  });

  describe("Disabled state", () => {
    it("is not disabled by default", async () => {
      const page = render(Component, { text: "Option" });
      await expect.element(page.getByRole("switch")).not.toBeDisabled();
    });

    it("can be disabled", async () => {
      const page = render(Component, { text: "Option", disabled: true });
      await expect.element(page.getByRole("switch")).toBeDisabled();
    });
  });

  describe("Label", () => {
    it("has label from text", async () => {
      const page = render(Component, { text: "Basic" });
      await expect.element(page.getByLabelText("Basic")).toBeInTheDocument();
    });

    it("has label from secondary text", async () => {
      const page = render(Component, {
        text: "Basic",
        secondaryText: "Secondary",
      });
      await expect
        .element(page.getByLabelText("Secondary"))
        .toBeInTheDocument();
    });

    it("has label from trailing text", async () => {
      const page = render(Component, {
        text: "Basic",
        trailingText: "Trailing",
      });
      await expect.element(page.getByLabelText("Trailing")).toBeInTheDocument();
    });
  });
});
