/* @canonical/generator-ds 0.10.0-experimental.0 */

import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Switch.svelte";

describe("Switch component", () => {
  it("renders", async () => {
    const page = render(Component);
    await expect.element(page.getByRole("switch")).toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { props: { id: "test-id" } });
      await expect
        .element(page.getByRole("switch"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, { props: { class: "test-class" } });
      await expect.element(page.getByRole("switch")).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, { props: { style: "color: red;" } });
      await expect.element(page.getByRole("switch")).toHaveStyle("color: red;");
    });
  });

  describe("Switch state", () => {
    it("is not checked by default", async () => {
      const page = render(Component);
      const switchElement = page.getByRole("switch");
      await expect.element(switchElement).not.toBeChecked();
      await expect
        .element(switchElement)
        .toHaveAttribute("aria-checked", "false");
    });

    it("can be checked", async () => {
      const page = render(Component, { props: { checked: true } });
      const switchElement = page.getByRole("switch");
      await expect.element(switchElement).toBeChecked();
      await expect
        .element(switchElement)
        .toHaveAttribute("aria-checked", "true");
    });

    it("isn't disabled by default", async () => {
      const page = render(Component);
      const switchElement = page.getByRole("switch");
      await expect.element(switchElement).not.toBeDisabled();
      await expect
        .element(switchElement)
        .not.toHaveAttribute("aria-readonly", "true");
    });

    it("can be disabled", async () => {
      const page = render(Component, { props: { disabled: true } });
      const switchElement = page.getByRole("switch");
      await expect.element(switchElement).toBeDisabled();
      await expect
        .element(switchElement)
        .toHaveAttribute("aria-readonly", "true");
    });

    it("toggles checked state on click", async () => {
      const page = render(Component);
      const switchElement = page.getByRole("switch");

      await expect.element(switchElement).not.toBeChecked();
      await switchElement.click();
      await expect.element(switchElement).toBeChecked();
      await expect
        .element(switchElement)
        .toHaveAttribute("aria-checked", "true");

      await switchElement.click();
      await expect.element(switchElement).not.toBeChecked();
      await expect
        .element(switchElement)
        .toHaveAttribute("aria-checked", "false");
    });
  });

  describe("Group controlled", () => {
    it("isn't checked if group and value are undefined", async () => {
      const page = render(Component, {
        props: { group: undefined, value: undefined },
      });
      await expect.element(page.getByRole("switch")).not.toBeChecked();
    });

    it("isn't checked if group doesn't include value", async () => {
      const page = render(Component, {
        props: { group: ["a", "b"], value: "c" },
      });
      await expect.element(page.getByRole("switch")).not.toBeChecked();
    });

    it("is checked if group includes value", async () => {
      const page = render(Component, {
        props: { group: ["a", "b", "c"], value: "c" },
      });
      await expect.element(page.getByRole("switch")).toBeChecked();
    });
  });

  describe("Events", () => {
    it("emits change event on click", async () => {
      const onchange = vi.fn();

      const page = render(Component, { props: { onchange } });
      const switchElement = page.getByRole("switch");
      await switchElement.click();
      expect(onchange).toHaveBeenCalledOnce();
    });
  });

  describe("Accessibility", () => {
    it("can be focused", async () => {
      const page = render(Component);
      const switchElement = page.getByRole("switch");
      (switchElement.element() as HTMLElement).focus();
      await expect.element(switchElement).toHaveFocus();
    });

    // TODO: Keyboard interaction tests
  });
});
