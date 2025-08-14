/* @canonical/generator-ds 0.10.0-experimental.0 */

import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Checkbox.svelte";

describe("Checkbox component", () => {
  it("renders", async () => {
    const page = render(Component);
    await expect.element(page.getByRole("checkbox")).toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { props: { id: "test-id" } });
      await expect
        .element(page.getByRole("checkbox"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, { props: { class: "test-class" } });
      await expect
        .element(page.getByRole("checkbox"))
        .toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, { props: { style: "color: red;" } });
      await expect
        .element(page.getByRole("checkbox"))
        .toHaveStyle("color: red;");
    });
  });

  describe("Checked state", () => {
    it("is not checked by default", async () => {
      const page = render(Component);
      await expect.element(page.getByRole("checkbox")).not.toBeChecked();
    });

    it("can be checked", async () => {
      const page = render(Component, { props: { checked: true } });
      await expect.element(page.getByRole("checkbox")).toBeChecked();
    });

    it("isn't disabled by default", async () => {
      const page = render(Component);
      await expect.element(page.getByRole("checkbox")).not.toBeDisabled();
    });

    it("can be disabled", async () => {
      const page = render(Component, { props: { disabled: true } });
      await expect.element(page.getByRole("checkbox")).toBeDisabled();
    });

    it("toggles on click", async () => {
      const page = render(Component);
      const checkbox = page.getByRole("checkbox");

      await expect.element(checkbox).not.toBeChecked();
      await checkbox.click();
      await expect.element(checkbox).toBeChecked();
    });

    it("is not indeterminate by default", async () => {
      const page = render(Component);
      await expect
        .element(page.getByRole("checkbox"))
        .not.toHaveAttribute("indeterminate");
    });

    it("can be indeterminate", async () => {
      const onlyIndeterminate = render(Component, {
        props: { indeterminate: true },
      });
      await expect
        .element(onlyIndeterminate.getByRole("checkbox"))
        .toBePartiallyChecked();
    });
  });

  describe("Group controlled", () => {
    it("isn't checked if group and value are undefined", async () => {
      const page = render(Component, {
        props: { group: undefined, value: undefined },
      });
      await expect.element(page.getByRole("checkbox")).not.toBeChecked();
    });

    it("isn't checked if group doesn't include value", async () => {
      const page = render(Component, {
        props: { group: ["a", "b"], value: "c" },
      });
      await expect.element(page.getByRole("checkbox")).not.toBeChecked();
    });

    it("is checked if group includes value", async () => {
      const page = render(Component, {
        props: { group: ["a", "b", "c"], value: "c" },
      });
      await expect.element(page.getByRole("checkbox")).toBeChecked();
    });
  });

  describe("Events", () => {
    it("emits change event on click", async () => {
      const onchange = vi.fn();

      const page = render(Component, { props: { onchange } });
      const checkbox = page.getByRole("checkbox");

      await expect.element(checkbox).not.toBeChecked();
      await checkbox.click();
      expect(onchange).toHaveBeenCalledOnce();
    });
  });
});
