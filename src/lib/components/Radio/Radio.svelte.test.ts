/* @canonical/generator-ds 0.10.0-experimental.0 */

import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Radio.svelte";

describe("Radio component", () => {
  it("renders", async () => {
    const page = render(Component);
    await expect.element(page.getByRole("radio")).toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { props: { id: "test-id" } });
      await expect
        .element(page.getByRole("radio"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, { props: { class: "test-class" } });
      await expect.element(page.getByRole("radio")).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, { props: { style: "color: red;" } });
      await expect.element(page.getByRole("radio")).toHaveStyle("color: red;");
    });
  });

  describe("Checked state", () => {
    it("is not checked by default", async () => {
      const page = render(Component);
      await expect.element(page.getByRole("radio")).not.toBeChecked();
    });

    it("can be checked", async () => {
      const page = render(Component, { props: { checked: true } });
      await expect.element(page.getByRole("radio")).toBeChecked();
    });

    it("isn't disabled by default", async () => {
      const page = render(Component);
      await expect.element(page.getByRole("radio")).not.toBeDisabled();
    });

    it("can be disabled", async () => {
      const page = render(Component, { props: { disabled: true } });
      await expect.element(page.getByRole("radio")).toBeDisabled();
    });

    it("can be checked by on click", async () => {
      const page = render(Component);
      const radio = page.getByRole("radio");

      await expect.element(radio).not.toBeChecked();
      await radio.click();
      await expect.element(radio).toBeChecked();
    });
  });

  describe("Group controlled", () => {
    it("isn't checked if group and value are undefined", async () => {
      const page = render(Component, {
        props: { group: undefined, value: undefined },
      });
      await expect.element(page.getByRole("radio")).not.toBeChecked();
    });

    it("isn't checked if group doesn't match value", async () => {
      const page = render(Component, {
        props: { group: "test-group", value: "test-value" },
      });
      await expect.element(page.getByRole("radio")).not.toBeChecked();
    });

    it("is checked if group and value match", async () => {
      const page = render(Component, {
        props: { group: "test-value", value: "test-value" },
      });
      await expect.element(page.getByRole("radio")).toBeChecked();
    });
  });
});
